import React, { useState, useEffect } from 'react';
import {
  PostDetailContainer,
  PostContentContainer,
  CommentsContainer,
  Backto,
  UserContainer,
  Avatar,
  AvatarImage,
  AuthorContainer,
  Author,
  CreatedAt,
  ContentContainer,
  Image,
  LikesContainer,
  Likes,
  LikeButton,
  LikeIcon,
  CommentContainer,
  CommentAvatar,
  CommentContent,
  CommentAuthor,
  CommentText,
  CommentCreatedAt,
  LikeBackContainer,
} from './BoardStyles';
import { Post } from '../../states/board/BoardStore';
import { comments as initialComments } from '../../states/board/ChatStore';
import { members } from '../../states/board/MemberStore'; // 멤버 데이터를 가져옵니다
import backto from '../../assets/BackTo.svg';
import userAvatar from '../../assets/user.svg'; // 기본 아바타 이미지
import UnLike from '../../assets/UnLike.svg';
import Like from '../../assets/Like.svg';
import PostDetailSkeleton from '../../components/board/PostDetailSkeleton'; // PostDetailSkeleton 가져오기
import useFormatDate from '../../hooks/UseFormatDate'; // 경로 수정

interface PostDetailProps {
  postId: number;
  onBackToList: () => void;
  toggleLike: (postId: number) => void;
  posts: Post[]; // posts 상태 추가
}

const PostDetail: React.FC<PostDetailProps> = ({ postId, onBackToList, toggleLike, posts }) => {
  const post = posts.find(post => post.boardId === postId);
  const postComments = initialComments.filter(comment => comment.boardId === postId);

  const [loading, setLoading] = useState(true);
  const formatDate = useFormatDate();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000); // 로딩 시간을 조정할 수 있습니다.
  }, [postId]);

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  const getMemberById = (memberId: number) => {
    return members.find(member => member.memberId === memberId);
  };

  return (
    <PostDetailContainer>
      {loading ? (
        <PostDetailSkeleton />
      ) : (
        <PostContentContainer>
          <UserContainer>
            <Avatar>
              <AvatarImage src={userAvatar} alt="Avatar" />
            </Avatar>
            <AuthorContainer>
              <Author>{`작성자 ${post.memberId}`}</Author>
              <CreatedAt>{formatDate(post.createdAt)}</CreatedAt>
            </AuthorContainer>
          </UserContainer>
          <ContentContainer>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
          </ContentContainer>
          <Image src="image.png" alt="Content" />
          <LikeBackContainer>
            <button onClick={onBackToList}>
              <Backto src={backto} />
            </button>
            <LikesContainer>
              <Likes>likes {post.likes}</Likes>
              <LikeButton
                onClick={(e: any) => {
                  e.stopPropagation();
                  toggleLike(post.boardId);
                }}
              >
                <LikeIcon src={post.likedByUser ? Like : UnLike} alt="like/unlike" />
              </LikeButton>
            </LikesContainer>
          </LikeBackContainer>
        </PostContentContainer>
      )}
      <CommentsContainer>
        {loading ? (
          <PostDetailSkeleton />
        ) : postComments.length === 0 ? (
          <p>댓글이 없습니다.</p>
        ) : (
          postComments.map(comment => {
            const member = getMemberById(comment.memberId);
            return (
              <CommentContainer key={comment.commentId}>
                {member && (
                  <CommentAvatar>
                    <AvatarImage src={member.profilePicture} alt={member.name} />
                  </CommentAvatar>
                )}
                <CommentContent>
                  <div className="flex flex-row items-center space-x-2">
                    <CommentAuthor>{member?.name}</CommentAuthor>
                    <CommentCreatedAt>{formatDate(comment.createdAt)}</CommentCreatedAt>
                  </div>
                  <CommentText>{comment.content}</CommentText>
                </CommentContent>
              </CommentContainer>
            );
          })
        )}
      </CommentsContainer>
    </PostDetailContainer>
  );
};

export default PostDetail;