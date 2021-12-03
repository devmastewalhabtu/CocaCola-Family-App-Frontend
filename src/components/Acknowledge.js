import React from 'react'

function Acknowledge(props) {
    console.log(props)
    return (
        <div className="main-overlay">
            <div className="ackno">
                <div className="ackno__inner">
                    <p>Thank you for participating!</p>
                    <p>Your quiz is sent to your loved one.</p>
                </div>
                <small>
                    <a href={props.asd}>link</a>
                </small>
            </div>
        </div>
    )
}

export default Acknowledge
