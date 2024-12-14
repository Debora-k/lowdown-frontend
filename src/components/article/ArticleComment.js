import React, { useEffect, useRef, useState } from 'react';
import './styles/articleComment.style.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  createComment,
  deleteComment,
  suggestComment,
  updateComment,
  clearComment,
  getComments,
  clearPage,
} from '../../features/comment/commentSlice';
import RobotIcon from '../../assets/icons/RobotIcon';
import { useLocation } from 'react-router-dom';
import { setSelectedArticle } from '../../features/article/articleSlice';
import LoadingComment from '../common/LoadingComment';
import LoadingSpinner from '../common/LoadingSpinner';
import CommentCard from './CommentCard';

function ArticleComment({ articleId, commentRef, page }) {
  const dispatch = useDispatch();
  const { selectedArticle } = useSelector((store) => store.article);
  const location = useLocation();
  const isFromFavorite = location.pathname === '/myfavorite';
  const user = useSelector((store) => store.user.user);
  const [loginError, setLoginError] = useState(
    user ? null : '* You need to log in to comment'
  );
  const { error, commentList, loading, totalPageNum } = useSelector(
    (store) => store.comments
  );

  const eventObj = {
    handleLike: (commentId) => {
      if (!user) {
        setLoginError('* Log in to access the comment feature');
        return;
      }
      const payload = { articleId, commentId, likeRequest: true };
      dispatch(updateComment(payload));
    },
    handleAdd: async ({ payload }) => {
      await dispatch(createComment(payload));
      dispatch(
        setSelectedArticle({
          ...selectedArticle,
          totalCommentCount: selectedArticle.totalCommentCount + 1,
        })
      );
    },
    handleEdit: ({ commentId, contents }) => {
      const payload = { articleId, commentId, contents };
      dispatch(updateComment(payload));
    },
    handleDelete: async (commentId) => {
      await dispatch(deleteComment({ commentId, articleId, isFromFavorite }));
      dispatch(
        setSelectedArticle({
          ...selectedArticle,
          totalCommentCount: selectedArticle.totalCommentCount - 1,
        })
      );
    },
  };

  return (
    <div className="comment" ref={commentRef}>
      <span style={{ color: 'red' }}>{loginError}</span>
      {/* user write comment */}
      {user && (
        <CommentUser
          articleId={articleId}
          user={user}
          isFromFavorite={isFromFavorite}
          eventObj={eventObj}
        />
      )}
      {/* comment lists */}
      <div className="comment__list">
        {!error &&
          commentList.map((item, idx) => {
            let isLast = false;
            if (commentList.length - 1 === idx) isLast = true;
            return (
              <CommentCard
                key={item._id}
                comment={item}
                user={user}
                eventObj={eventObj}
                isLast={isLast}
                totalPageNum={totalPageNum}
                page={page}
                articleId={articleId}
              />
            );
          })}
        {loading && totalPageNum >= page && <LoadingSpinner />}
      </div>
    </div>
  );
}

function CommentUser({ articleId, user, isFromFavorite, eventObj }) {
  const dispatch = useDispatch();

  const textRef = useRef();
  const [hasComment, setHasComment] = useState(false);
  const [hasUsedSuggestion, setHasUsedSuggestion] = useState(false);
  const suggestedComment = useSelector(
    (state) => state.comments.suggestedComment
  );

  function handleInput() {
    const textarea = textRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight + 1}px`;
      setHasComment(textarea.value !== '');

      if (textarea.value === '') {
        dispatch(clearComment());
        setHasComment(false);
        setHasUsedSuggestion(false);
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { value } = textRef.current;
    if (!user) return;

    if (value.trim() === '') return;
    const payload = { articleId, contents: value, isFromFavorite };
    eventObj.handleAdd({ payload });
    handleReset();
    dispatch(clearPage());
  }

  function handleReset() {
    const textarea = textRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight + 1}px`;

    dispatch(clearComment());
    setHasComment(false);
    setHasUsedSuggestion(false);

    if (textarea) {
      textarea.style.height = 'auto';
      textarea.value = '';
    }
  }

  function handleSuggestComment() {
    if (suggestedComment !== '') {
      setHasUsedSuggestion(true);
      const textarea = textRef.current;

      if (textarea) {
        textarea.value = suggestedComment;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight + 1}px`;
      }
    } else {
      dispatch(suggestComment({ comment: textRef.current.value }));
    }
  }

  return (
    <>
      <div className="comment__user">
        <div className="image-container">
          <img src={user.picture} alt="your profile pic" />
        </div>
        <form
          onSubmit={handleSubmit}
          tabIndex={0}
          className="comment__user-form"
        >
          <textarea
            className="comment__user-comment"
            ref={textRef}
            placeholder="Add a comment..."
            name="comment"
            onInput={handleInput}
            rows={1}
          />
          {hasComment && !hasUsedSuggestion && (
            <button
              className={`comment__ai ${
                suggestedComment && 'comment__ai--active'
              }`}
              type="button"
              onClick={handleSuggestComment}
            >
              <RobotIcon />{' '}
              {suggestedComment
                ? 'Click here to use the suggestion!'
                : 'Do you want to get a suggested comment from me?'}
            </button>
          )}
          {suggestedComment && !hasUsedSuggestion && (
            <RenderingAi suggestedComment={suggestedComment} />
          )}
          <div className="comment__user-btns">
            <button type="button" onClick={handleReset}>
              Cancel
            </button>
            <button type="submit">Comment</button>
          </div>
        </form>
      </div>
    </>
  );
}

function RenderingAi({ suggestedComment }) {
  const [aiText, setAiText] = useState('');
  useEffect(() => {
    if (suggestedComment) {
      let c = 0;
      let m = suggestedComment.length - 1;
      let timer = setInterval(() => {
        setAiText(suggestedComment.slice(0, c + 1));
        c = c + 1;
        if (c > m) {
          clearInterval(timer);
        }
      }, 25);
    }
    return () => {
      setAiText('');
    };
  }, [suggestedComment]);

  return (
    <div>
      <p className="comment__ai-text">{aiText}</p>
    </div>
  );
}

export default ArticleComment;
