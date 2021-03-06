import React, { useEffect, useLayoutEffect, useState } from 'react'
import banner from '../assets/img/banner-full.png'
import cocacan from '../assets/img/coca-can.png'
import cocashade from '../assets/img/coca-shade.png'
import flower from '../assets/img/flower.png'
import bottle from '../assets/img/bottle.png'
import flame1 from '../assets/img/flame-1.png'
import { FaFacebook } from 'react-icons/fa'
import Loader from "react-loader-spinner";
import Popup from 'reactjs-popup';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { Link, useParams } from 'react-router-dom'
import { getScoreById, upload } from '../_helpers/cloudFunctions'
import html2canvas from 'html2canvas';

function ScorePage() {
    const { hostname } = window.location
    const hostArr = hostname.split('.')
    const countryCode = hostArr[hostArr.length - 1]?.toUpperCase()
    // const { path } = useContext(RouteContext)
    const { id } = useParams()
    const [videos, setVideos] = useState([
        // "https://file-examples-com.github.io/uploads/2020/03/file_example_WEBM_480_900KB.webm",
        // "https://file-examples-com.github.io/uploads/2020/03/file_example_WEBM_480_900KB.webm"
    ])
    const [percentage, setPercentage] = useState(null)
    const [shareCode, setShareCode] = useState('')
    const [relation, setRelation] = useState('')
    const [thumb, setThumb] = useState('')
    const [open, setOpen] = useState(true)

    useEffect(() => {
        getScoreById(id.replace('/', '')).then((res) => {
            const data = res.data;
            const vids = data.videos?.map(vd => vd?.replace("http://localhost:9199/", "https://d7baf04cb52966.localhost.run/"))
            setRelation(data.relation || 'family')
            setVideos(vids || [])
            setShareCode(data.shareCode || '');
            setPercentage((data.percentage || 0).toFixed(0));
        }).catch(err => {
            setOpen(false)
            let errorMsg = "Score not found"
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
    }, [id])

    useLayoutEffect(() => {
        // if (percentage !== null)
        if(localStorage.getItem(`scoreId/${id}`)) {
            setThumb(localStorage.getItem(`scoreId/${id}`))
            setOpen(false)
        }
        else if (percentage !== null) {
            console.log("screen shooting...")
            const ele = document.querySelector('.ht2can')
            const img = ele.querySelector('.score__img')
            // const vids = [...mediaEle.children]
            const footers = document.querySelectorAll('.grad')
            const header = document.querySelector('.score__header')
            footers.forEach(toggleStyleForCanvas);
            toggleStyleForCanvas(header);
            img.style.maxHeight = 'unset'
            html2canvas(ele, {
                allowTaint: true,
                useCORS: true,
                logging: false
            }).then(function (canvas) {
                ele.classList.remove('ht2can-bg')
                img.style.maxHeight = '460px'
                footers.forEach(toggleStyleForCanvas)
                toggleStyleForCanvas(header)

                // document.body.appendChild(canvas)
                const dt = canvas.toDataURL("image/jpg");
                const blob = b64toBlob(dt)
                let file = new File([blob], `score-share.jpg`)
                upload(file).then(({ data }) => {
                    setThumb(data?.link)
                    localStorage.setItem(`scoreId/${id}`, data?.link)
                    setOpen(false)
                }).catch(e => {
                    console.log(e)
                    setOpen(false)
                })

            }).catch(e => {
                ele.classList.remove('ht2can-bg')
                img.style.maxHeight = '460px'
                footers.forEach(toggleStyleForCanvas)
                toggleStyleForCanvas(header)
            })
        }
        // eslint-disable-next-line
    }, [percentage])

    return (
        <div className="page score">
            <div className="ht2can ht2can-bg fl-col align-center">
                {percentage !== null ? (<h2 className="score__header">
                    WE SCORED <span className="score__value" title={`${percentage}%`}>{percentage}%</span> IN
                </h2>) : (
                    <p className="score__header"></p>
                )}
                <div className="score__body">
                    <img src={banner} alt="" className="score__logo" />
                    {/* <CameraPage /> */}
                    {/* <img src={path?.img} alt="" className="score__img" /> */}
                    <div className="media">
                        {!videos?.length ? <div className='score__video' /> : videos.map((vid, i) => {
                            if (vid.endsWith('.gif') || vid.endsWith('.png')) {
                                return <img key={i} style={{width: videos?.length === 2 ? '50%' : '100%'}} src={vid} alt="" className="score__img" />
                            } else {
                                return <video key={i} src={vid} className={videos.length > 1 ? 'score__video split' : 'score__video'} muted loop autoPlay />
                            }
                        })}
                    </div>
                    <img src={flower} alt="" className="floating-img floating-img--1" />
                    <img src={bottle} alt="" className="floating-img floating-img--2" />
                    <img src={flower} alt="" className="floating-img floating-img--3" />
                    <img src={flower} alt="" className="floating-img floating-img--4" />
                </div>
            </div>

            <div className="score__footer fl-col align-center">
                {percentage !== null && (
                    <>
                        <p className="grad text large">Your Participation Code: #{shareCode}</p>
                        <a href={`https://www.facebook.com/share.php?u=${thumb}&quote=` + encodeURIComponent(`My ${relation} and I scored ${percentage}% in the Coca-Cola Reunion Trivia Challenge! Think you can do better? Challenge yourself at ${window?.location?.origin} and check out my video at ${window.location.href} \n\n#CokeReunion${countryCode || ''} \n #${shareCode || ''}`)}
                            data-action="share/facebook/share" target="_blank" rel="noreferrer" className="link">
                            <FaFacebook size={28} color="white" />
                        </a>
                        <p className="grad text x-large">SHARE YOUR RESULTS NOW</p>
                        <p className="text small">include hashtag #CokeReunionSG and your participation code (eg. #12345)</p>
                        <p className="grad text med">Share the video and tell us who do you want to share a Coke with this CNY and why.</p>
                        <p className="grad text med">Most creative entries will stand to win weekly prizes!</p>
                    </>
                )}

                <div className="score__can-img">
                    <img src={cocacan} alt="" className="img" />
                    <img src={cocashade} alt="" className="shade" />
                    <img src={flame1} alt="" className="flame flame-1" />
                    <img src={flame1} alt="" className="flame flame-2" />
                    <div className="vouchers vouchers--1">
                        VOUCHERS
                        <img src={flower} alt="" className="flower flower--1" />
                        <img src={flower} alt="" className="flower flower--2" />
                    </div>
                    <div className="vouchers vouchers--2">
                        VOUCHERS
                        <img src={flower} alt="" className="flower flower--1" />
                        <img src={flower} alt="" className="flower flower--2" />
                    </div>
                    <div className="advert advert--1">
                        <p className="inner-text">Week 2 (17-23 Jan 2022)</p>
                        <p className="inner-text">x50 Coca-Cola Hamper</p>
                    </div>
                    <div className="advert advert--2">
                        <p className="inner-text">Week 1 (10 -16 Jan 2021)</p>
                        <p className="inner-text">x50 1-year supply of Coca-Cola</p>
                    </div>
                    <div className="advert advert--3">
                        <p className="inner-text">Week 4 (31-6 Feb 2022)</p>
                        <p className="inner-text">x20 Reunion Dinner Vouchers</p>
                    </div>
                    <div className="advert advert--4">
                        <p className="inner-text">Week 3 (24 -30 Jan 2022)</p>
                        <p className="inner-text">x50 Yu Sheng Vouchers</p>
                    </div>
                </div>
                <Link to="/terms" className="grad text med">Find out more at Terms and Conditions</Link>

                <img src={flame1} alt="" className="floating-img floating-img--5" />
                <img src={flower} alt="" className="floating-img floating-img--6" />
            </div>

            <Popup open={open} className="login-popup" lockScroll={true} closeOnDocumentClick={false} onClose={() => setOpen(false)}>
                <div className="modal">
                    <Loader
                        type="TailSpin"
                        color="#FEFEFE"
                        height={40}
                        width={40}
                    />
                    <span className="modal__text">Loading...</span>
                </div>
            </Popup>
            <ToastContainer autoClose={4500} theme="dark" transition={Slide} />
        </div>
    )

    function b64toBlob(b64Data, contentType = 'image/png', sliceSize = 512) {
        let data = b64Data.split(',')[1]
        const byteCharacters = atob(data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    function toggleStyleForCanvas(ele) {
        ele.style.background = ele.style.background ? '' : 'none';
        ele.style.color = ele.style.color ? '' : '#ECD473';
    }
}

export default ScorePage
