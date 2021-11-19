import './assets/scss/main.scss';
import { CameraPage, LoginPage, PlayersPage, SocialLinkPage, WelcomePage } from './pages';
import { Routes, Route } from 'react-router-dom';
import UserContext from './_helpers/userContext';
import RouteContext from './_helpers/routeContext';
import soundfile from './assets/audio/chinese_new_year.mp3'
import Sound from 'react-sound'
import { useState } from 'react';

function App() {
  const pathStr = localStorage.getItem('_path')
  const userStr = localStorage.getItem('_user')
  let userData;
  try {
      userData = JSON.parse(userStr)
  } catch (e) {
      userData = null
  }
  let pathData;
  try {
      pathData = JSON.parse(pathStr)
  } catch (e) {
      pathData = null
  }
  const [user, setUser] = useState(userData)
  const [path, setPath] = useState(pathData)
  
  return (
    <UserContext.Provider value={{ user, storeUser }}>
      <RouteContext.Provider value={{ path, storePath }}>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="players" element={<PlayersPage />} />
          <Route path="links" element={<SocialLinkPage />} />
          <Route path="game" element={<CameraPage />} />
          <Route path="sg" element={<WelcomePage />} />
          <Route path="sg/login" element={<LoginPage />} />
          <Route path="sg/players" element={<PlayersPage />} />
          <Route path="sg/links" element={<SocialLinkPage />} />
          <Route path="sg/game" element={<CameraPage />} />
          <Route path="my" element={<WelcomePage />} />
          <Route path="my/login" element={<LoginPage />} />
          <Route path="my/players" element={<PlayersPage />} />
          <Route path="my/links" element={<SocialLinkPage />} />
          <Route path="my/game" element={<CameraPage />} />
        </Routes>
      </RouteContext.Provider>
      <Sound
        url={soundfile}
        playStatus={Sound.status.PLAYING}
        autoLoad={true}
        loop={true}
      />
    </UserContext.Provider>
  );

  function storeUser(user) {
    setUser(user)
    const userStr = JSON.stringify(user)
    localStorage.setItem("_user", userStr)
  }

  function storePath(path) {
    setPath(path)
    const pathStr = JSON.stringify(path)
    localStorage.setItem("_path", pathStr)
  }
}

export default App;