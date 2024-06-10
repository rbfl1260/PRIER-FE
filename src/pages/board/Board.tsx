import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Container, NoPostsMessage } from './BoardStyles';
import { posts as initialPosts, Post } from '../../states/board/BoardStore';
import PaginationComponent from '../../components/board/PaginationComponent';
import PostSkeleton from '../../components/board/PostSkeleton';
import NavigationBar from '../../components/board/NavigationBar';
import PostList from './PostList';
import PostDetail from './PostDetail';
import PostDetailSkeleton from '../../components/board/PostDetailSkeleton';

const Board: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const location = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('it-news');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const sortedPosts = initialPosts.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setPosts(sortedPosts);
      setLoading(false);
    }, 2000); // 로딩 시간을 조정할 수 있습니다.
  }, []);

  useEffect(() => {
    if (!postId) {
      let updatedPosts = posts;
      if (activeFilter === 'all') {
        updatedPosts = posts.filter(post => post.category === activeCategory);
      } else if (activeFilter === 'likes') {
        updatedPosts = posts.filter(post => post.category === activeCategory && post.likedByUser);
      } else if (activeFilter === 'myposts') {
        updatedPosts = posts.filter(post => post.category === activeCategory && post.memberId === 1); // 임의로 memberId를 1로 설정
      }
      setFilteredPosts(updatedPosts);
    }
  }, [posts, activeCategory, activeFilter, postId]);

  // 좋아요 토글 함수
  const toggleLike = (postId: number) => {
    setPosts(prevPosts =>
      prevPosts.map(post => (post.boardId === postId ? { ...post, likedByUser: !post.likedByUser } : post)),
    );
  };

  // 카테고리 변경을 처리하는 함수
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    navigate(`/board?category=${category}&filter=${activeFilter}`);
  };

  // 필터 변경을 처리하는 함수
  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    navigate(`/board?category=${activeCategory}&filter=${filter}`);
  };

  const handlePostClick = (postId: number) => {
    navigate(`/board/post/${postId}`); // postId를 URL로 전달하여 페이지를 이동합니다.
  };

  const handleBackToList = () => {
    navigate(`/board?category=${activeCategory}&filter=${activeFilter}`); // 상세보기에서 목록으로 돌아가기
  };

  const getTitle = () => {
    if (activeFilter === 'all') return 'Community';
    if (activeFilter === 'likes') return 'Likes';
    if (activeFilter === 'myposts') return 'My Posts';
    return 'Board';
  };

  const isDetailPage = location.pathname.includes('post');

  return (
    <Container>
      <NavigationBar
        activeCategory={activeCategory}
        activeFilter={activeFilter}
        handleCategoryClick={handleCategoryClick}
        handleFilterClick={handleFilterClick}
        title={getTitle()}
      />
      {loading && !postId ? (
        <>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </>
      ) : postId ? (
        loading ? (
          <PostDetailSkeleton />
        ) : (
          <PostDetail postId={Number(postId)} onBackToList={handleBackToList} toggleLike={toggleLike} posts={posts} />
        )
      ) : (
        <PostList posts={filteredPosts} onPostClick={handlePostClick} toggleLike={toggleLike} />
      )}
      {!postId && <PaginationComponent />}
    </Container>
  );
};

export default Board;
