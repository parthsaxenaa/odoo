# StackIt – A Minimal Q&A Forum Platform

**Team Name:** parthsaxena2022  Team 3135
**Project Type:** StackIt – A Minimal Q&A Forum Platform


![StackIt Banner](https://via.placeholder.com/800x200?text=StackIt+-+Collaborative+Q%26A+Platform)

## Overview
StackIt is a minimalist question-and-answer platform designed to facilitate structured knowledge sharing within communities. With a focus on core Q&A functionality and clean user experience, StackIt enables users to:

- Ask technical questions with rich formatting
- Share expertise through answers
- Organize knowledge through tagging
- Validate solutions through voting

[View Mockup Design](https://link.excalidraw.com/l/65VNwvy7c4X/8bM86GXnnUN)

## User Roles & Permissions
| Role | Permissions |
|------|-------------|
| **Guest** | View all questions and answers |
| **User** | Register, log in, post questions/answers, vote, receive notifications |
| **Admin** | Moderate content, manage users, send platform notifications |

## Core Features

### 1. Question Management
- **Rich Text Editor** for question descriptions with:
  - Text formatting (Bold, Italic, Strikethrough)
  - Lists (Numbered/Bulleted)
  - Media support (Images, Hyperlinks)
  - Emoji insertion
  - Text alignment options
- **Tagging System**: Multi-select tags (e.g., React, JWT) for content organization

### 2. Answer System
- Rich text answers using same editor
- Voting mechanism (upvote/downvote)
- Question owner can mark **accepted answer**
- Login requirement for posting answers

### 3. Notification System
- Real-time notification bell with unread counter
- Triggers:
  - New answers to user's questions
  - Comments on user's answers
  - @mentions in discussions
- Dropdown with recent notifications

### 4. Admin Features
- **Content Moderation**:
  - Approve/reject skill descriptions
  - Manage reported content
- **User Management**:
  - Ban violating users
  - Monitor swap statuses (pending/accepted/cancelled)
- **Platform Administration**:
  - Send broadcast messages
  - Generate activity reports
  - Download usage statistics

## Technology Stack
- **Frontend**: React.js, Redux, Rich Text Editor
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Deployment**: Docker, AWS

## Installation
```bash
# Clone repository
git clone https://github.com/parthsaxena2022/StackIt.git

# Install dependencies
cd StackIt
npm install

# Configure environment variables
cp .env.example .env

# Start development server
npm run dev
