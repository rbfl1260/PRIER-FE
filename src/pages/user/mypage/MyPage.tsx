import React, { useEffect, useState } from 'react';
import {
  DetailText,
  FeedbackContainer,
  IntroduceContainer,
  LinkProject,
  UniqueText,
  ProfileContainer,
  ProfileTextContainer,
  ProjectContainer,
  QuestContainer,
  ReviewWrapper,
  StaticContainer,
  Step,
  StepCircle,
  StepLabel,
  StepLine,
  StepsContainer,
  MypageChartIcon,
  StyledGraphIcon,
  StyledUserIcon,
  TitleText,
  ProfileAccountContainer,
  CorrectText,
  AIReportContainer,
  ProfileText,
  StyledInput,
} from './MyPageStyle';
import { ReactComponent as TeamProfile } from '../../../assets/MainAvatar.svg';
import { Title } from '../../main/MainStyle';
import { LinkText } from '../../../components/user/UserStyle';
import { Link, useNavigate } from 'react-router-dom';
import MyReview from '../../../components/user/MyReview';
import { EditBelonging, EditNickName, FetchLogout, FetchMyPage } from '../../../services/UserApi';
import { useUserStore } from '../../../states/user/UserStore';
import CustomAlert from '../../../components/utils/CustomAlert';

export default function MyPage() {
  const navigate = useNavigate();
  const userProfile = useUserStore(state => state.userProfile);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showEditNameAlert, setShowEditNameAlert] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newNickName, setNewNickName] = useState<string>('');
  const [showEditBelongingAlert, setShowEditBelongingAlert] = useState(false);
  const [isEditingBelonging, setIsEditingBelonging] = useState(false);
  const [newBelonging, setNewBelonging] = useState<string>('');
  const UseFetchLogout = FetchLogout();

  useEffect(() => {
    // FetchMyPage();
  }, []);
  //로그아웃
  const ConfirmLogout = () => {
    setShowLogoutAlert(true);
  };
  const CancelLogout = () => {
    setShowLogoutAlert(false);
  };
  const Logout = async () => {
    setShowLogoutAlert(false);
    await UseFetchLogout();
    navigate('/');
  };

  //닉네임 수정
  const NickNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewNickName(event.target.value);
  };
  const setEditName = () => {
    setIsEditingName(true);
  };
  const ConfirmEditName = () => {
    setShowEditNameAlert(true);
  };
  const saveEditName = async () => {
    try {
      await EditNickName(newNickName);
      setIsEditingName(false);
    } catch (error) {
      console.error('닉네임 수정 중 오류 발생:', error);
    }
  };
  const cancleEditName = () => {
    setIsEditingName(false);
    setShowEditNameAlert(false);
    setNewNickName('');
  };
  //소속 수정
  const BelongingInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewBelonging(event.target.value);
  };
  const setEditBelonging = () => {
    setIsEditingBelonging(true);
  };
  const ConfirmEditBelonging = () => {
    setShowEditBelongingAlert(true);
  };
  const saveEditBelonging = async () => {
    try {
      await EditBelonging(newBelonging);
      setIsEditingBelonging(false);
    } catch (error) {
      console.error('소속 수정 중 오류 발생:', error);
    }
  };
  const cancleEditBelonging = () => {
    setIsEditingBelonging(false);
    setShowEditBelongingAlert(false);
    setNewBelonging('');
  };

  return (
    <div className="flex-col" style={{ margin: '1% 7%' }}>
      {showLogoutAlert && (
        <CustomAlert message="정말 로그아웃 하시겠습니까?" onConfirm={Logout} onCancel={CancelLogout} />
      )}
      {showEditNameAlert && (
        <CustomAlert message="정말 수정 하시겠습니까?" onConfirm={saveEditName} onCancel={cancleEditName} />
      )}
      {showEditBelongingAlert && (
        <CustomAlert message="정말 수정 하시겠습니까?" onConfirm={saveEditBelonging} onCancel={cancleEditBelonging} />
      )}
      <div className="flex w-full">
        <ProfileContainer>
          <StyledUserIcon></StyledUserIcon>
          <div className="flex-col mt-3 w-full">
            <span className="flex items-center justify-between">
              <Title>반갑습니다 {userProfile.nickname} 님</Title>
              <CorrectText onClick={ConfirmLogout}>로그 아웃</CorrectText>
            </span>

            {isEditingName ? (
              <ProfileTextContainer>
                <span className="flex">
                  <ProfileText>닉네임 : </ProfileText>
                  <StyledInput type="text" value={newNickName} onChange={NickNameInputChange}></StyledInput>
                </span>
                <CorrectText onClick={ConfirmEditName}>확인</CorrectText>
              </ProfileTextContainer>
            ) : (
              <ProfileTextContainer>
                <span className="flex">
                  <ProfileText>닉네임 : </ProfileText>
                  <ProfileText> {userProfile.nickname} </ProfileText>
                </span>
                <CorrectText onClick={setEditName}>수정 하기</CorrectText>
              </ProfileTextContainer>
            )}
            {isEditingBelonging ? (
              <ProfileTextContainer>
                <span className="flex">
                  <ProfileText>소속: </ProfileText>
                  <StyledInput type="text" value={newBelonging} onChange={BelongingInputChange}></StyledInput>
                </span>
                <CorrectText onClick={ConfirmEditBelonging}>확인</CorrectText>
              </ProfileTextContainer>
            ) : (
              <ProfileTextContainer>
                <span className="flex">
                  <ProfileText>소속 : </ProfileText>
                  <ProfileText> {userProfile.belonging} </ProfileText>
                </span>
                <CorrectText onClick={setEditBelonging}>수정 하기</CorrectText>
              </ProfileTextContainer>
            )}
            <ProfileTextContainer>
              <ProfileText>등급 : </ProfileText>
              <ProfileText>{userProfile.rank} </ProfileText>
            </ProfileTextContainer>
            <ProfileTextContainer>
              <ProfileText>계정 정보 : </ProfileText>
            </ProfileTextContainer>
            <ProfileAccountContainer>
              <span className="flex justify-between items-center">
                <ProfileText>{userProfile.github} </ProfileText>
                <CorrectText>수정 하기</CorrectText>
              </span>
            </ProfileAccountContainer>
          </div>
        </ProfileContainer>
        <div className="flex-col" style={{ width: '50%' }}>
          <IntroduceContainer>
            <p className="text-base mb-2 cursor-pointer">자신을 한줄로 소개</p>
            <h1 className="text-2xl font-semibold">{userProfile.intro}안녕하세요</h1>
            <CorrectText className="text-end">수정하기</CorrectText>
          </IntroduceContainer>
          <QuestContainer>
            <h1 className="mb-2 cursor-pointer">오늘의 퀘스트</h1>
            <StepsContainer>
              <Step>
                <StepLabel completed={parseInt(userProfile.quest) >= 1}>출석하기</StepLabel>
                <StepCircle completed={parseInt(userProfile.quest) >= 1} color="#8e8ae3" />
              </Step>
              <StepLine />
              <Step>
                <StepLabel completed={parseInt(userProfile.quest) >= 2}>댓글 작성하기</StepLabel>
                <StepCircle completed={parseInt(userProfile.quest) >= 2} color="#f4c542" />
              </Step>
              <StepLine />
              <Step>
                <StepLabel completed={parseInt(userProfile.quest) >= 3}>피드백 참여하기</StepLabel>
                <StepCircle completed={parseInt(userProfile.quest) >= 3} color="#4188FE" />
              </Step>
            </StepsContainer>
          </QuestContainer>
        </div>
      </div>
      <div className="flex justify-between mt-5">
        <ProjectContainer>
          <div className="flex items-baseline justify-between">
            <Title>진행 중인 프로젝트</Title>
            <Link to="/testlist">
              <LinkText>전체 프로젝트 &gt;</LinkText>
            </Link>
          </div>
          <div className="flex ">
            <div className="flex-col">
              <Link to="/createtest">
                <LinkProject>
                  <div className="flex items-center gap-3">
                    <TeamProfile />
                    <p className="text-lg">COCODAS</p>
                  </div>
                  <p className="text-gray-600 text-center mt-2">웹 IDE 프로젝트</p>
                </LinkProject>
              </Link>
              <FeedbackContainer>
                <Link to="/feedback">
                  <TitleText>제출된 피드백</TitleText>
                  <UniqueText>34</UniqueText>
                  <DetailText>+ {} 34개의 피드백이 추가로 제출되었습니다.</DetailText>
                  <LinkText className="text-end">모아보기 &gt;</LinkText>
                </Link>
              </FeedbackContainer>
            </div>
            <StaticContainer>
              <TitleText>통계</TitleText>
              <UniqueText>평점</UniqueText>
              <UniqueText>{userProfile.statistic} % </UniqueText>
              <DetailText>평점 4의 별점</DetailText>
              <MypageChartIcon></MypageChartIcon>
            </StaticContainer>
            <AIReportContainer>
              <div className="flex gap-4">
                <TitleText>AI 분석 Report</TitleText>
                <StyledGraphIcon></StyledGraphIcon>
              </div>
            </AIReportContainer>
          </div>
        </ProjectContainer>
        <ReviewWrapper>
          <Title>{userProfile.nickname} 님의 리뷰</Title>
          <ul>
            <MyReview />
          </ul>
        </ReviewWrapper>
      </div>
    </div>
  );
}
