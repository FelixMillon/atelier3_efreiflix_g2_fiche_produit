import React, { useState, useEffect } from 'react';
import './styles/comments.css';

const Comments = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "User_2024",
      date: "2024-03-20",
      content: "Ce film est un chef-d'œuvre du genre. La performance des acteurs est exceptionnelle !",
      likes: 5,
      isHelpful: false
    },
    {
      id: 2,
      user: "SeriesLover",
      date: "2024-03-19",
      content: "Une réalisation impeccable. Le scénario est prenant du début à la fin.",
      likes: 182,
      isHelpful: false
    },
    {
      id: 3,
      user: "CinemaFan",
      date: "2024-03-15",
      content: "Les effets spéciaux sont impressionnants, mais l'histoire manque un peu de profondeur.",
      likes: 89,
      isHelpful: false
    }
  ]);

  const [sortBy, setSortBy] = useState('pertinence');
  const [totalLikes, setTotalLikes] = useState(0);

  // Calcul du total des likes
  useEffect(() => {
    const likes = comments.reduce((sum, comment) => sum + comment.likes, 0);
    setTotalLikes(likes);
  }, [comments]);

  // Fonction pour gérer les likes
  const handleLike = (commentId) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        const newIsHelpful = !comment.isHelpful;
        return {
          ...comment,
          likes: comment.likes + (newIsHelpful ? 1 : -1),
          isHelpful: newIsHelpful
        };
      }
      return comment;
    }));
  };

  // Tri des commentaires
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'pertinence') {
      return b.likes - a.likes;
    } else {
      return new Date(b.date) - new Date(a.date);
    }
  });

  // Formatage de la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="netflix-comments">
      <h3>Avis des membres</h3>
      
      <div className="comments-header">
        <div className="comments-stats">
          <span>{comments.length} avis • {totalLikes} likes</span>
        </div>
        
        <div className="comments-sort">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="pertinence">Les plus pertinents</option>
            <option value="date">Les plus récents</option>
          </select>
        </div>
      </div>
      
      <div className="comments-list">
        {sortedComments.map(comment => (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <div className="user-info">
                <img 
                  src={`https://ui-avatars.com/api/?name=${comment.user}&background=E50914&color=fff`} 
                  alt={comment.user}
                  className="user-avatar"
                />
                <span className="username">{comment.user}</span>
              </div>
              <div className="comment-meta">
                <span className="likes">👍 {comment.likes}</span>
                <span className="date">{formatDate(comment.date)}</span>
              </div>
            </div>
            <div className="comment-content">
              {comment.content}
            </div>
            <div className="comment-actions">
              <button 
                className={`helpful-btn ${comment.isHelpful ? 'active' : ''}`}
                onClick={() => handleLike(comment.id)}
              >
                {comment.isHelpful ? 'Utile ✓' : 'Utile'}
              </button>
              <button className="report-btn">
                Signaler
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;