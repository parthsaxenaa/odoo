# StackIt – Minimal Q&A Platform

**Team Name:** parthsaxena2022  
**Project Type:** Collaborative Knowledge Sharing Platform  
**Status:** Active Development  

![StackIt Screenshot](https://via.placeholder.com/1200x600?text=StackIt+Interface+Preview)

## Overview
StackIt is a minimalist question-and-answer platform designed for efficient knowledge exchange. Prioritizing usability and core functionality, StackIt enables communities to:
- Quickly find solutions through structured Q&A
- Curate knowledge with voting and tagging systems
- Maintain content quality through moderation tools

[View Interactive Mockup](https://link.excalidraw.com/l/65VNwvy7c4X/8bM86GXnnUN)

## Key Features

### 🚀 Question Management
| Feature | Details |
|---------|---------|
| **Rich Text Editor** | WYSIWYG editing with media support |
| **Tagging System** | Multi-select categorization + tag suggestions |
| **Question Formatting** | Title (120 char limit) + detailed description |

### 💬 Engagement Features
| Feature | Description |
|---------|-------------|
| Answer System | Threaded replies with same rich editor |
| Voting | Upvote/downvote answers (+5/-2 rep) |
| Accepted Answer | Green checkmark + 15 reputation bonus |
| @Mentions | User notifications in content |

### 🔔 Notification System
```mermaid
graph LR
    A[New Answer] --> B(Notification Bell)
    C[Comment] --> B
    D[@Mention] --> B
    B --> E{User Dashboard}
