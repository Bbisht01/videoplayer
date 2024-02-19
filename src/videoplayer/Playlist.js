import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import './Videoplayer.css'

const Playlist = ({ playlist, onVideoClick }) => {
  const handleDragEnd = result => {
    if (!result.destination) return
    const newPlaylist = Array.from(playlist)
    const [removed] = newPlaylist.splice(result.source.index, 1)
    newPlaylist.splice(result.destination.index, 0, removed)
    onVideoClick(newPlaylist, result.destination.index)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId='playlist'>
        {provided => (
          <ul
            className='playlist'
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {playlist.map((video, index) => (
              <Draggable
                key={video.id}
                draggableId={video.id.toString()}
                index={index}
              >
                {provided => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onVideoClick(playlist, index)}
                  >
                    {video.title}
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default Playlist

// import React, { useState, useRef, useEffect } from 'react'
// import './Videoplayer.css'
// const Playlist = ({ playlist, onVideoClick }) => {
//   const [draggedIndex, setDraggedIndex] = useState(null)

//   const handleDragStart = (e, index) => {
//     setDraggedIndex(index)
//     e.dataTransfer.effectAllowed = 'move'
//     e.dataTransfer.setData('text/plain', index)
//   }

//   const handleDragOver = (e, index) => {
//     e.preventDefault()
//     if (index !== draggedIndex) {
//       const newPlaylist = [...playlist]
//       const [removed] = newPlaylist.splice(draggedIndex, 1)
//       newPlaylist.splice(index, 0, removed)
//       onVideoClick(newPlaylist)
//       setDraggedIndex(index)
//     }
//   }

//   return (
//     <div className='playlist'>
//       <h2>Playlist</h2>
//       <ul>
//         {playlist.map((video, index) => (
//           <li
//             key={video.id}
//             draggable
//             onDragStart={e => handleDragStart(e, index)}
//             onDragOver={e => handleDragOver(e, index)}
//             onClick={() => onVideoClick(playlist, index)}
//           >
//             {video.title}
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }

// export default Playlist
