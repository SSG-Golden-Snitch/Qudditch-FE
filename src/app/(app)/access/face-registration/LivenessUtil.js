export const hintDisplayText = {
  hintMoveFaceFrontOfCameraText: '카메라 앞으로 얼굴을 이동하세요',
  hintTooManyFacesText: '카메라 앞에 너무 많은 얼굴이 있습니다. 한 개의 얼굴만 남겨주세요',
  hintFaceDetectedText: '얼굴이 감지되었습니다',
  hintCanNotIdentifyText: '카메라 앞으로 얼굴을 이동하세요',
  hintTooCloseText: '너무 가까이 다가가지 마세요',
  hintTooFarText: '더 가까이 다가가세요',
  hintConnectingText: '연결 중...',
  hintVerifyingText: '확인 중...',
  hintCheckCompleteText: '확인 완료',
  hintIlluminationTooBrightText: '더 어둡은 곳으로 이동하세요',
  hintIlluminationTooDarkText: '더 밝은 곳으로 이동하세요',
  hintIlluminationNormalText: '조명이 적절합니다',
  hintHoldFaceForFreshnessText: '가만히 있으세요',
  hintCenterFaceText: '얼굴을 중앙에 맞추세요',
  hintCenterFaceInstructionText:
    '지시: 확인을 시작하기 전에 카메라가 화면 상단 중앙에 있고 얼굴이 카메라 중앙에 있는지 확인하세요. 확인이 시작되면 화면 중앙에 타원이 나타납니다. 타원 안쪽으로 전진하라는 지시가 표시되며 일정 시간동안 가만히 있으면 확인이 완료됩니다.',
  hintFaceOffCenterText: '얼굴이 타원 중앙에 없습니다. 카메라 중앙에 얼굴을 맞추세요.',
  hintMatchIndicatorText: '50% 완료. 더 가까이 다가가세요.',
}

export const cameraDisplayText = {
  cameraMinSpecificationsHeadingText: '카메라가 최소 요구 사양을 충족하지 않습니다',
  cameraMinSpecificationsMessageText:
    '카메라는 최소 320*240 해상도와 초당 15 프레임을 지원해야 합니다.',
  cameraNotFoundHeadingText: '카메라를 찾을 수 없습니다',
  cameraNotFoundMessageText:
    '카메라가 연결되어 있고 다른 애플리케이션이 카메라를 사용하지 않는지 확인하세요. 카메라 권한을 부여하기 위해 설정으로 이동하고 브라우저의 모든 인스턴스를 닫고 다시 시도해야 할 수 있습니다.',
  retryCameraPermissionsText: '다시 시도',
  waitingCameraPermissionText: '카메라 권한을 허용하기를 기다리는 중입니다.',
  a11yVideoLabelText: '확인용 웹캠',
}

export const instructionDisplayText = {
  goodFitCaptionText: '적절한 맞춤',
  goodFitAltText: '얼굴이 동그란 도형 안에 완벽하게 맞추어진 이미지',
  photosensitivityWarningBodyText:
    '이 확인은 다양한 색의 빛을 사용합니다. 빛에 예민하신 분은 주의하세요.',
  photosensitivityWarningHeadingText: '광민감성 주의',
  photosensitivityWarningInfoText:
    '일부 사람은 색상 빛에 노출되면 발작을 경험할 수 있습니다. 당신이나 가족 중 누군가 발작을 겪은 적이 있는 경우 주의하세요.',
  photosensitivityWarningLabelText: '광민감성에 대한 자세한 정보',
  startScreenBeginCheckText: '확인 시작하기',
  tooFarCaptionText: '너무 멀리 떨어져 있습니다',
  tooFarAltText: '얼굴이 동그란 도형 안쪽에 완벽하게 들어가지 않은 이미지',
}

export const streamDisplayText = {
  recordingIndicatorText: '녹화 중',
  cancelLivenessCheckText: '확인 취소',
}

export const customDefaultErrorDisplayText = {
  errorLabelText: '오류',
  timeoutHeaderText: '시간 초과',
  timeoutMessageText:
    '얼굴이 타원 안에 제 시간 안에 들어오지 않았습니다. 다시 시도하고 얼굴을 완전히 타원 안에 채워 넣으세요.',
  faceDistanceHeaderText: '전진 움직임 감지됨',
  faceDistanceMessageText: '연결 중에 더 가까이 다가가지 마세요.',
  multipleFacesHeaderText: '다중 얼굴이 감지되었습니다',
  multipleFacesMessageText: '연결 중에는 카메라 앞에 한 개의 얼굴만 존재해야 합니다.',
  clientHeaderText: '클라이언트 오류',
  clientMessageText: '클라이언트 문제로 인해 확인 실패',
  serverHeaderText: '서버 문제',
  serverMessageText: '서버 문제로 확인을 완료할 수 없습니다',
  landscapeHeaderText: '가로 모드는 지원되지 않습니다',
  landscapeMessageText: '기기를 세로 모드로 회전하세요.',
  portraitMessageText: '확인을 위해 기기를 세로 모드로 유지하세요.',
  tryAgainText: '다시 시도',
}
