import React, { useState, useRef, useEffect } from 'react'
import './Videoplayer.css'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
// import {
//   FaPlay,
//   FaPause,
//   FaVolumeUp,
//   FaVolumeDown,
//   FaVolumeMute,
//   FaExpand,
//   FaCompress
// } from 'react-icons/fa'

const Videoplayer = () => {
  const [playlist, setPlaylist] = useState([
    {
      id: 1,
      title: 'Video 1',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
    },
    {
      id: 2,
      title: 'Video 2',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
    },
    {
      id: 3,
      title: 'Video 2',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
    }
    // Add more videos as needed
  ])

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [volume, setVolume] = useState(0.5)
  const [isFullScreen, setIsFullScreen] = useState(false)

  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (isPlaying) {
      video.play()
    } else {
      video.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    const video = videoRef.current
    video.volume = volume
  }, [volume])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleSeek = time => {
    videoRef.current.currentTime = time
    setCurrentTime(time)
  }

  const handleSpeedChange = speed => {
    setPlaybackSpeed(speed)
    videoRef.current.playbackRate = speed
  }

  const handleVideoEnd = () => {
    if (currentVideoIndex < playlist.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1)
    } else {
      setCurrentVideoIndex(0)
    }
  }

  const handleVideoClick = index => {
    setCurrentVideoIndex(index)
  }

  const handleVolumeChange = value => {
    setVolume(value)
  }

  const handleFullScreenToggle = () => {
    const video = videoRef.current
    if (!isFullScreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen()
      } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen()
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen()
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    }
    setIsFullScreen(!isFullScreen)
  }

  const handleDragEnd = result => {
    if (!result.destination) return

    const items = [...playlist]
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setPlaylist(items)
  }

  return (
    <div className='app'>
      <div className='video-container'>
        <video
          ref={videoRef}
          src={playlist[currentVideoIndex].url}
          onEnded={handleVideoEnd}
          playbackRate={playbackSpeed}
          autoPlay
          controls
        />
        {/* <div className='controls'>
          <button onClick={handlePlayPause}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <input
            type='range'
            value={currentTime}
            max={duration}
            onChange={e => handleSeek(e.target.value)}
          />
          <span>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <select
            onChange={e => handleSpeedChange(parseFloat(e.target.value))}
            value={playbackSpeed}
          >
            <option value='0.5'>0.5x</option>
            <option value='1'>1x</option>
            <option value='1.5'>1.5x</option>
            <option value='2'>2x</option>
          </select>
          <input
            type='range'
            value={volume}
            min={0}
            max={1}
            step={0.01}
            onChange={e => handleVolumeChange(parseFloat(e.target.value))}
          />
          <button onClick={handleFullScreenToggle}>
            {isFullScreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div> */}
      </div>
      <div className='playlist'>
        <h2>Playlist</h2>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId='playlist'>
            {provided => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {playlist.map((video, index) => (
                  <Draggable
                    key={video.id}
                    draggableId={`video-${video.id}`}
                    index={index}
                  >
                    {provided => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => handleVideoClick(index)}
                      >
                        <div className='video-thumbnail'>
                          <img
                            src={`https://img.youtube.com/vi/${video.id}/0.jpg`}
                            alt={`Thumbnail for ${video.title}`}
                          />
                        </div>
                        <div className='video-title'>{video.title}</div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  )
}

const formatTime = time => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

export default Videoplayer
