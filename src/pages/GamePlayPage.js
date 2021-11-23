import React, { useState } from 'react'
import Popup from 'reactjs-popup';
import { Acknowledge, CameraComponent, GameStartOverlay, QuestionOverlay } from '../components'

import { CameraComponent, GameStartOverlay, QuestionOverlay } from '../components'
import { getQuiz } from '../_helpers/cloudFunctions';
import { ToastContainer, toast, Slide } from 'react-toastify';
function GamePlayPage() {
    const [gameStared, setGameStared] = useState(false)
    const [questions, setQuestions] = useState([])
    return (
        <>
            <CameraComponent />
            {
                gameStared ? <QuestionOverlay questions={{questions}}/> : <GameStartOverlay startGame={startGame} />
            }
            
            <Popup lockScroll={true} open={true} className="ackno-popup" closeOnDocumentClick>
                <Acknowledge />
            </Popup>
            <ToastContainer autoClose={4500} theme="dark" transition={Slide} />

        </>
    )

    function startGame() {
        getQuiz(2)
            .then(response => {
                setQuestions(response.data.questions)

                setGameStared(true);
            }).catch(e => {
                console.log(e.response?.data?.msg?.detail)
                toast(e.response?.data?.msg?.detail || 'Error has occured.', {
                    position: "bottom-center",
                    autoClose: 4500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                });
            })
    }
}

export default GamePlayPage