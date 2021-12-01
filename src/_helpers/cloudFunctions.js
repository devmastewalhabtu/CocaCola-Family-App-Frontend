// import { httpsCallable } from "firebase/functions";
// import { functions } from "./Firebase";
import axios from "axios";

const api = 'https://0473-2a01-4f8-172-40a6-00-2.ngrok.io/coke-cny/us-central1'

axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    if(error.response?.status === 401) {
        localStorage.removeItem("_user")
        window.location.reload()
    }
    return Promise.reject(error);
});

export const getScore = (challangeId,respondentId ) => {
   return axios.post(`${api}/getScore`, {challangeId, respondentId}); 
}
export const getChallenge = (challengeInstanceId) =>{
    return axios.post(`${api}/getChallenge`, {challengeInstanceId});
}
export const onChallengeCreated = (challengeInstanceId) =>{
    return axios.post(`${api}/onChallengeCreated`,{challengeInstanceId})
}
export const addChallenge = (questionId,challangeInstanceId,answerId) => {
    return axios.post(`${api}/addChallange`,{questionId,challangeInstanceId,answerId});
}
export const sendCode = (name,phone_number) =>{
    return axios.post(`${api}/sendCode`,{name,phone_number},)
}
export const createChallengeInstance = (challangerId) =>{
    return axios.post(`${api}/createChallangeInstance`,{challangerId})
}
export const verifyToken = (verificationId,sms_token) =>{
    return axios.post(`${api}/verifyToken`,{verificationId,sms_token});
}
export const generateInviteLink = (uid, relation) => {
    return axios.post(`${api}/generateInviteLink`, {uid: uid.uid, relation})
}

export const onInvitationLink = (invitationId, invitedId) => {
    return axios.post(`${api}/onInvitationLink`, {invitationId, invitedId})
}

export const addFamily = (userId, familyMemberId, relation) => {
    return axios.post(`${api}/addFamily`, {userId, familyMemberId, relation})
}

export const getInviteDetails = (invitationId) => {
    return axios.post(`${api}/getInviteDetails`, {invitationId})
}

export const addQuestion = (questionText) => {
    return axios.post(`${api}/addQuestion`, {questionText})
}

export const addChoiceToQuestion = (qid, answersText) => {
    return axios.post(`${api}/addChoiceToQuestion`, {qid, answersText})
}

export const answerQuestion = (respondentId, challangeId, questionId, questionChoiceId) => {
    return axios.post(`${api}/answerQuestion`, {respondentId, challangeId, questionId, questionChoiceId})
}

export const getQuiz = (numberOfQuestions) => {
    return axios.post(`${api}/getQuiz`, {numberOfQuestions})
}

// admin apis
export const getUsers = () => {
    return axios.get(`${api}/admin/users`)
}
