import React, { useState, useLayoutEffect, useEffect, useRef, useContext } from 'react'
import flower from '../assets/img/flower.png'
import flame1 from '../assets/img/flame-1.png'
import banner from '../assets/img/banner-full.png'
import Loader from "react-loader-spinner";
import Popup from 'reactjs-popup';
import grandpa from '../assets/img/tiger-1.png'
import grandma from '../assets/img/tiger-2.png'
import father from '../assets/img/tiger-3.png'
import mother from '../assets/img/tiger-4.png'
import sister from '../assets/img/tiger-5.png'
import brother from '../assets/img/tiger-6.png'
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'reactjs-popup/dist/index.css';
import CodeVerification from '../components/codeVerification';
import ReactFlagsSelect from 'react-flags-select';
import { useLocation, useNavigate } from 'react-router-dom';
import RouteContext from '../_helpers/routeContext';
import { sendCode } from '../_helpers/cloudFunctions';
import UserContext from '../_helpers/userContext';
// import { onInvitationLink } from '../_helpers/cloudFunctions';

function LoginPage() {
    const [name, setName] = useState('')
    const [toLogin, setToLogin] = useState(false)
    const [prefix, setPrefix] = useState('+65')
    const [countries, setCountries] = useState(["SG", "MY"])
    const [phone, setPhone] = useState('+65')
    const [selected, setSelected] = useState('SG')
    const [errors, setErrors] = useState({})
    const [loginSuccess, setLoginSuccess] = useState(false)
    const [open, setOpen] = useState(false);
    let { state } = useLocation()
    const { storePath } = useContext(RouteContext)
    const { user } = useContext(UserContext)
    const containerRef = useRef(null);
    const toggleModal = (state) => setOpen(state);
    const [verificationId, setVerificationId] = useState('');
    const [uid, setUid] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        const { hostname } = window.location
        const hostArr = hostname.split('.')
        const countryCode = hostArr[hostArr.length - 1]?.toLowerCase()
        if (countryCode === 'my') {
            setCountries(["MY"])
            setSelected('MY')
            setPrefix('+60')
            setPhone('+60')
        } else if (countryCode === 'sg') {
            setCountries(["SG"])
        }
    }, [])

    useEffect(() => {
        if (state) {
            const { via, linkId, challengeId } = state
            if (via === "LINK") {
                storePath({ via, linkId })
            } else if (via === "CHALLENGE") {
                storePath({ via, challengeId })
            } else if (via === "TOGETHER") {
                storePath({ via })
            } else if (via === "NORMAL") {
                storePath({ via })
            }
            //Auto Login if session exist 
        }
        const { via } = state || {}
        if (via === "LINK") {
            console.log("here is it")
            navigate(`/game`, { replace: true })
            return;
        }
        if (user) {
            if (via === "CHALLENGE") {
                navigate(`/game`)
            } else {
                navigate(`/players`, { replace: true })
            }
        } else {
            setToLogin(true)
        }
        //eslint-disable-next-line
    }, [])

    useLayoutEffect(() => {
        const page = document.querySelector('.page');
        page.style.minHeight = window.innerHeight + 'px'
        return () => {
            window.recaptchaVerifier = null;
        }
        //eslint-disable-next-line
    }, [])

    return (
        <div className="page login fl-col just-center align-center">
            {
                toLogin && (
                    <>
                        <div className="img-container fl-col just-center align-center">
                            <img src={banner} alt="" className="main-banner" />
                        </div>
                        <div ref={containerRef}>
                            <div id="recaptcha-container"></div>
                        </div>
                        {!loginSuccess ?
                            (<form onSubmit={onSubmitHandler} className="form fl-col just-center align-center">
                                <h2 className="form__header">Enter your details</h2>
                                <div className="form__group">
                                    <label htmlFor="" className="form__label">NAME:</label>
                                    <input onChange={e => setName(e.target.value)} name="name" type="text" value={name} className="form__input" />
                                </div>
                                <span className="form__error">{errors["name"]}</span>
                                <div className="form__group">
                                    <label htmlFor="" className="form__label form__label--phone">MOBILE NO:</label>
                                    <div className="form__container fl-row align-center">
                                        <ReactFlagsSelect
                                            fullWidth={false}
                                            showSelectedLabel={false}
                                            className="menu-flags"
                                            selectButtonClassName="menu-flags-button"
                                            selected={selected} countries={countries}
                                            onSelect={onCountrySelect} />
                                        <input onChange={e => updatePhone(e.target.value)} name="phone" type="tel" value={phone} className="form__input--phone" />
                                    </div>
                                </div>
                                <span className="form__error">{errors["phone"]}</span>
                                <button id="sign-in-button" type="submit" className="img-btn form__btn">
                                    SEND
                                </button>
                            </form>) :
                            (<CodeVerification userData={{ name, phone, verificationId, uid }} nextPage={state} toggleModal={toggleModal} />)
                        }

                        <Popup open={open} className="login-popup" closeOnDocumentClick={false} onClose={() => toggleModal(false)}>
                            <div className="modal">
                                <Loader
                                    type="TailSpin"
                                    color="#FEFEFE"
                                    height={40}
                                    width={40}
                                />
                                <span className="modal__text">Logging in</span>
                            </div>
                        </Popup>
                        <ToastContainer autoClose={4500} theme="dark" transition={Slide} limit={1} />

                        <img src={flower} alt="" className="floating-img floating-img--1" />
                        <img src={flower} alt="" className="floating-img floating-img--2" />
                        <img src={flower} alt="" className="floating-img floating-img--3" />
                        <img src={flower} alt="" className="floating-img floating-img--4" />
                        <img src={flower} alt="" className="floating-img floating-img--5" />
                        <img src={flame1} alt="" className="floating-img floating-img--6" />
                        <div className="temp-imgs">
                            <img src={grandpa} alt="" className="tiger__img" />
                            <img src={grandma} alt="" className="tiger__img" />
                            <img src={father} alt="" className="tiger__img" />
                            <img src={mother} alt="" className="tiger__img" />
                            <img src={sister} alt="" className="tiger__img" />
                            <img src={brother} alt="" className="tiger__img" />
                        </div>
                    </>
                )
            }
        </div>
    )

    function onCountrySelect(code) {
        const pre = code === "SG" ? '+65' : '+60'
        setPrefix(pre)
        setSelected(code)
        setPhone(pre)
    }

    function handleValidation() {
        let fields = { name, phone };
        let errs = {};
        let formIsValid = true;

        // Name
        if (!fields["name"]) {
            formIsValid = false;
            errs["name"] = "Name cannot be empty";
        }
        // Phone
        if (!fields["phone"]) {
            formIsValid = false;
            errs["phone"] = "Phone cannot be empty";
        }

        // Phone
        if (fields["phone"].length > 2 && fields["phone"].length < 7) {
            formIsValid = false;
            errs["phone"] = "Phone does not have enough digits";
        }

        setErrors(errs)
        return formIsValid;
    }

    // function setupRecaptcha() {
    //     const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    //         'size': 'invisible',
    //         'callback': (response) => {
    //             // reCAPTCHA solved, allow signInWithPhoneNumber.
    //             onSubmitHandler()
    //         },
    //         'expired-callback': () => {
    //             // Response expired. Ask user to solve reCAPTCHA again.
    //             recaptchaVerifier.clear()
    //             containerRef.current.innerHTML = `<div id="recaptcha-container"></div>`
    //             toast("Recaptcha expired. Try again", {
    //                 position: "bottom-center",
    //                 autoClose: 4500,
    //                 hideProgressBar: true,
    //                 closeOnClick: true,
    //                 pauseOnHover: false,
    //                 draggable: false,
    //                 progress: undefined,
    //             });
    //         }
    //     }, auth);
    //     return recaptchaVerifier
    // }

    function updatePhone(val) {
        if (val.length > 14) return
        let newVal = val.slice(prefix.length)
        setPhone(prefix + newVal)
    }

    function onSubmitHandler(e) {
        console.log("submitting")
        e.preventDefault()
        // navigate("/players")

        if (!handleValidation()) {
            return
        }
        toggleModal(true)
        //TODO: setup Recaptach
        //  const recaptchaVerifier = setupRecaptcha()
        // console.log(recaptchaVerifier);

        sendCode(name, phone)
            .then(response => {
                console.log(response.data)
                if (response.data.user !== undefined) {
                    var uid = Object.keys(response.data.user)[0]
                    setUid(uid)
                    toggleModal(false)
                    setLoginSuccess(true)
                } else {
                    var verificationId = response.data.result;
                    setVerificationId(verificationId)
                    toggleModal(false)
                    setLoginSuccess(true)
                }
            }).catch((error) => {
                toggleModal(false)
                console.error(error)
                let errorMsg = "Couldn't log you in"

                toast(errorMsg, {
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

export default LoginPage