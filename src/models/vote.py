from datetime import datetime
from src.models.user import db

class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user_email = db.Column(db.String(120), nullable=False)
    item_type = db.Column(db.String(10), nullable=False)  # 'question' or 'answer'
    item_id = db.Column(db.Integer, nullable=False)
    vote_type = db.Column(db.String(10), nullable=False)  # 'up' or 'down'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Composite unique constraint to prevent duplicate votes
    __table_args__ = (db.UniqueConstraint('user_email', 'item_type', 'item_id', name='unique_vote'),)
    
    def __repr__(self):
        return f'<Vote {self.user_email} {self.vote_type} {self.item_type} {self.item_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_email': self.user_email,
            'item_type': self.item_type,
            'item_id': self.item_id,
            'vote_type': self.vote_type,
            'created_at': self.created_at.isoformat()
        }

