import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './styles/articleComment.style.css';
import { dateFormatter } from '../../utils/dateFormatter';
import { getComments } from '../../features/comment/commentSlice';
import LikeIcon from '../../assets/icons/LikeIcon';
import EditIcon from '../../assets/icons/EditIcon';
import DeleteIcon from '../../assets/icons/DeleteIcon';
import Modal from '../../composition/Modal';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

function CommentCard({
  comment,
  user,
  eventObj,
  isLast,
  page,
  totalPageNum,
  articleId,
}) {
  const dispatch = useDispatch();
  const textRef = useRef();
  const editRef = useRef();
  const commentRef = useRef(null);
  const [large, setLarge] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isVisible = useInfiniteScroll(commentRef, { threshold: 1.0 });

  useEffect(() => {
    if (textRef.current) {
      const lineCount = textRef.current.value.split('\n').length;
      if (lineCount > 2) {
        setLarge(true);
      }
    }
  }, [textRef.current]);

  useEffect(() => {
    console.log(isLast, isVisible, totalPageNum, page);
    if (isLast && isVisible && totalPageNum >= page) {
      dispatch(getComments({ page: page + 1, articleId }));
    }
  }, [isVisible]);

  useEffect(() => {
    if (isEditing) {
      handleInput();
      editRef.current.focus();
    }
  }, [isEditing]);

  function handleInput() {
    const textarea = editRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight + 1}px`;
    }
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    e.returnValue = '';
    if (!editRef.current.value) {
      setIsEditing(false);
      setReadMore(true);
      return;
    }
    eventObj.handleEdit({
      commentId: comment._id,
      contents: editRef.current.value,
    });
    setIsEditing(false);
    setReadMore(true);
  }

  return (
    <section className="comment__list-card" key={comment._id} ref={commentRef}>
      <div className="image-container">
        <img src={comment.userId.picture} alt={comment.userId.name} />
      </div>
      <div className="comment__list-content">
        <div className="comment__profile">
          <h3>{comment.userId.name}</h3>
          <div className="comment__profile-date">
            {dateFormatter(comment.createdAt)}
          </div>
        </div>
        <div className="comment__list-comment">
          {isEditing ? (
            <form onSubmit={handleEditSubmit}>
              <textarea
                className="comment__list-edit"
                ref={editRef}
                onInput={handleInput}
                defaultValue={comment.contents}
                rows={1}
              />
              <div className="comment__list-btn-box">
                <button type="submit">Edit</button>
                <button type="button" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className={`${large && !readMore && 'hide'}`}>
                {comment.contents}
              </p>
              <textarea
                className="display-none"
                ref={textRef}
                value={comment.contents}
                readOnly
              />
            </>
          )}
        </div>
        {comment.isEdited && (
          <div className="comment__list-edited">(edited)</div>
        )}
        {!isEditing && large && (
          <button
            className="comment__list-readmore"
            onClick={() => setReadMore((prev) => !prev)}
          >
            {readMore ? 'Show less' : 'Read more'}
          </button>
        )}
        <CommentOption
          user={user}
          comment={comment}
          eventObj={eventObj}
          setIsEditing={setIsEditing}
        />
      </div>
    </section>
  );
}

function CommentOption({ comment, user, eventObj, setIsEditing }) {
  const [modalOn, setModalOn] = useState(false);
  let hasLike = comment.likes.find((item) => item.userId === user?._id);
  return (
    <>
      <div className="comment__option">
        <div className="comment__option-item">
          {/* LIKE */}
          <button
            onClick={() => eventObj.handleLike(comment._id)}
            title="like comment"
          >
            {hasLike ? <LikeIcon fill={true} /> : <LikeIcon fill={false} />}
          </button>
          {comment.totalLike}
        </div>
        {comment.userId._id === user?._id && (
          <>
            {/* EDIT */}
            <div className="comment__option-item">
              <button
                title="edit comment"
                onClick={() => setIsEditing((prev) => !prev)}
              >
                <EditIcon />
              </button>
            </div>
            {/* DELETE */}
            <div className="comment__option-item">
              <button title="delete comment" onClick={() => setModalOn(true)}>
                <DeleteIcon />
              </button>
            </div>
          </>
        )}
      </div>
      {modalOn && (
        <Modal setModalOn={setModalOn}>
          <div className="modal__title">
            Would you like to <span>delete</span> this comment?
          </div>
          <div className="modal__btn-box">
            <button
              className="modal__btn modal__btn--warn"
              onClick={() => {
                eventObj.handleDelete(comment._id);
                setModalOn(false);
              }}
            >
              Delete
            </button>
            <button onClick={() => setModalOn(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default CommentCard;
