from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.question import Question
from src.models.answer import Answer
from src.models.vote import Vote
from datetime import datetime

questions_bp = Blueprint('questions', __name__)

@questions_bp.route('/questions', methods=['GET'])
def get_questions():
    """Get all questions with optional filtering"""
    try:
        filter_type = request.args.get('filter', 'all')
        tag = request.args.get('tag')
        search = request.args.get('search')
        
        query = Question.query
        
        # Apply search filter
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                db.or_(
                    Question.title.ilike(search_term),
                    Question.description.ilike(search_term),
                    Question.tags.ilike(search_term),
                    Question.author_name.ilike(search_term)
                )
            )
        
        # Apply tag filter
        if tag:
            query = query.filter(Question.tags.ilike(f"%{tag}%"))
        
        # Apply type filter
        if filter_type == 'unanswered':
            query = query.outerjoin(Answer).group_by(Question.id).having(db.func.count(Answer.id) == 0)
        elif filter_type == 'trending':
            query = query.order_by(Question.votes.desc()).limit(10)
        else:
            query = query.order_by(Question.created_at.desc())
        
        questions = query.all()
        return jsonify([question.to_dict() for question in questions])
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@questions_bp.route('/questions', methods=['POST'])
def create_question():
    """Create a new question"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['title', 'description', 'authorName', 'authorEmail']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        question = Question(
            title=data['title'],
            description=data['description'],
            author_name=data['authorName'],
            author_email=data['authorEmail'],
            author_id=1,  # Default user ID for demo
            votes=0,
            views=0
        )
        
        # Set tags if provided
        if data.get('tags'):
            question.set_tags_list(data['tags'])
        
        db.session.add(question)
        db.session.commit()
        
        return jsonify(question.to_dict()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@questions_bp.route('/questions/<int:question_id>', methods=['GET'])
def get_question(question_id):
    """Get a specific question by ID"""
    try:
        question = Question.query.get_or_404(question_id)
        
        # Increment view count
        question.views += 1
        db.session.commit()
        
        return jsonify(question.to_dict())
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@questions_bp.route('/questions/<int:question_id>', methods=['PUT'])
def update_question(question_id):
    """Update a question"""
    try:
        question = Question.query.get_or_404(question_id)
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Check if user is the author
        if data.get('authorEmail') != question.author_email:
            return jsonify({'error': 'Unauthorized to edit this question'}), 403
        
        # Update fields
        if 'title' in data:
            question.title = data['title']
        if 'description' in data:
            question.description = data['description']
        if 'tags' in data:
            question.set_tags_list(data['tags'])
        
        question.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(question.to_dict())
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@questions_bp.route('/questions/<int:question_id>', methods=['DELETE'])
def delete_question(question_id):
    """Delete a question"""
    try:
        question = Question.query.get_or_404(question_id)
        data = request.get_json()
        
        # Check if user is the author
        if data.get('authorEmail') != question.author_email:
            return jsonify({'error': 'Unauthorized to delete this question'}), 403
        
        db.session.delete(question)
        db.session.commit()
        
        return jsonify({'message': 'Question deleted successfully'})
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@questions_bp.route('/questions/<int:question_id>/vote', methods=['POST'])
def vote_question(question_id):
    """Vote on a question"""
    try:
        question = Question.query.get_or_404(question_id)
        data = request.get_json()
        
        if not data or 'voteType' not in data or 'userEmail' not in data:
            return jsonify({'error': 'voteType and userEmail are required'}), 400
        
        vote_type = data['voteType']
        user_email = data['userEmail']
        
        if vote_type not in ['up', 'down']:
            return jsonify({'error': 'voteType must be "up" or "down"'}), 400
        
        # Check if user already voted
        existing_vote = Vote.query.filter_by(
            user_email=user_email,
            item_type='question',
            item_id=question_id
        ).first()
        
        if existing_vote:
            return jsonify({'error': 'You have already voted on this question'}), 400
        
        # Create new vote
        vote = Vote(
            user_id=1,  # Default user ID for demo
            user_email=user_email,
            item_type='question',
            item_id=question_id,
            vote_type=vote_type
        )
        
        # Update question vote count
        if vote_type == 'up':
            question.votes += 1
        else:
            question.votes -= 1
        
        db.session.add(vote)
        db.session.commit()
        
        return jsonify({
            'message': f'Question {vote_type}voted successfully',
            'votes': question.votes
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@questions_bp.route('/questions/<int:question_id>/answers', methods=['POST'])
def create_answer(question_id):
    """Create an answer for a question"""
    try:
        question = Question.query.get_or_404(question_id)
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['content', 'authorName', 'authorEmail']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        answer = Answer(
            content=data['content'],
            question_id=question_id,
            author_id=1,  # Default user ID for demo
            author_name=data['authorName'],
            author_email=data['authorEmail'],
            votes=0
        )
        
        db.session.add(answer)
        db.session.commit()
        
        return jsonify(answer.to_dict()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@questions_bp.route('/answers/<int:answer_id>', methods=['PUT'])
def update_answer(answer_id):
    """Update an answer"""
    try:
        answer = Answer.query.get_or_404(answer_id)
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Check if user is the author
        if data.get('authorEmail') != answer.author_email:
            return jsonify({'error': 'Unauthorized to edit this answer'}), 403
        
        # Update content
        if 'content' in data:
            answer.content = data['content']
        
        answer.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(answer.to_dict())
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@questions_bp.route('/answers/<int:answer_id>/vote', methods=['POST'])
def vote_answer(answer_id):
    """Vote on an answer"""
    try:
        answer = Answer.query.get_or_404(answer_id)
        data = request.get_json()
        
        if not data or 'voteType' not in data or 'userEmail' not in data:
            return jsonify({'error': 'voteType and userEmail are required'}), 400
        
        vote_type = data['voteType']
        user_email = data['userEmail']
        
        if vote_type not in ['up', 'down']:
            return jsonify({'error': 'voteType must be "up" or "down"'}), 400
        
        # Check if user already voted
        existing_vote = Vote.query.filter_by(
            user_email=user_email,
            item_type='answer',
            item_id=answer_id
        ).first()
        
        if existing_vote:
            return jsonify({'error': 'You have already voted on this answer'}), 400
        
        # Create new vote
        vote = Vote(
            user_id=1,  # Default user ID for demo
            user_email=user_email,
            item_type='answer',
            item_id=answer_id,
            vote_type=vote_type
        )
        
        # Update answer vote count
        if vote_type == 'up':
            answer.votes += 1
        else:
            answer.votes -= 1
        
        db.session.add(vote)
        db.session.commit()
        
        return jsonify({
            'message': f'Answer {vote_type}voted successfully',
            'votes': answer.votes
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@questions_bp.route('/tags', methods=['GET'])
def get_popular_tags():
    """Get popular tags"""
    try:
        # Get all questions and extract tags
        questions = Question.query.all()
        tag_counts = {}
        
        for question in questions:
            tags = question.get_tags_list()
            for tag in tags:
                tag_counts[tag] = tag_counts.get(tag, 0) + 1
        
        # Sort by count and return top 10
        popular_tags = sorted(tag_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        
        return jsonify([{'tag': tag, 'count': count} for tag, count in popular_tags])
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

