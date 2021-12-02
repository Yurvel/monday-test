import React, { useRef, useState } from 'react';
import { useQuery, useMutation } from "@apollo/client";

import { token, fileClient } from '../apollo/config';
import { GET_BOARDS, CREATE_ITEM, CREATE_UPDATE, ADD_FILE } from '../apollo/queries'

import Snackbar from './Snackbar';

const CreatItemForm = () => {
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [board, setBoard] = useState("");
  const [group, setGroup] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(false);
  
  const fileInput = useRef();
  
  const { loading: boardsLoading, data: boards } = useQuery(GET_BOARDS);
  const [createItem] = useMutation(CREATE_ITEM);
  const [createUpdate] = useMutation(CREATE_UPDATE);
  // const [addFile, { loading: addFileLoading, error: addFileError, data: addFileData }] = useMutation(ADD_FILE);

  const showNotification = () => {
    function hideNotification() {
      setShowSnackbar(false)
      setError(false)
    }

    setShowSnackbar(true)
    setTimeout(hideNotification, 3000)
  }

  const createHandler = async () => {
    try {
      const newItem = await createItem({
        variables: { 
          board_id: Number(board),
          group_id: group,
          item_name: name
        }
      })
      const newUpdate = await createUpdate({ 
        variables: { 
          item_id: Number(newItem.data.create_item.id),
          body: description,
        }
      })

      if (fileInput.current.files.length) {
        const formData = new FormData();
  
        formData.append('query', 'mutation ($update_id: Int!, $file: File!) {add_file_to_update (update_id: $update_id, file: $file) {id}}');
        formData.append('variables', JSON.stringify({'update_id': Number(newUpdate.data.create_update.id) }));
        formData.append('map', JSON.stringify({'image': 'variables.file'}));
        formData.append('image', fileInput.current.files[0]);
  
        await fetch('https://api.monday.com/v2/file', {
          mode: 'cors',
          method: 'POST',
          headers: {
            'Authorization': token,
            'Content-Type': 'multipart/form-data',
          },
          body: formData 
        });

        // or

        // await fileClient.mutate({
        //   mutation: ADD_FILE,
        //   variables: {
        //     update_id: Number(newUpdate.data.create_update.id),
        //       file: fileInput.current.files[0]
        //   }
        // })
      }
      
      console.log('Item created!');
    } catch (err) {
      setError(true)
      console.log('Error:', err);
    }
        
    await showNotification()

    setBoard('')
    setGroup('')
    setName('')
    setDescription('')
  }

  if(boardsLoading) return null

  return (
    <div>
      {showSnackbar && <Snackbar status={error ? 'error' : 'success'}/>}

      <h1>CREATE AN ITEM</h1>
      <div className="form">
        <label className="board">
          <span className="label">Board</span>
          <select value={board} onChange={e => setBoard(e.target.value)} className="input">
            <option>Select Board</option>
            {boards.boards.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
          </select>
        </label>
        <label className="group">
          <span className="label">Group</span>
          <select value={group} onChange={e => setGroup(e.target.value)} className="input">
            <option>Select Group</option>
            {board && boards.boards.find(({ id }) => id === board).groups.map(({ id, title }) => <option key={id} value={id}>{title}</option>)}
          </select>
        </label>
        <label className="name">
          <span className="label">Item Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="input"
          />
        </label>
        <label className="description">
          <span className="label">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input"
          />
        </label>
        <label className="image">
        <span className="label">Add image</span>
          <input type="file" className="input" ref={fileInput}/>
        </label>

        <button
          onClick={() => createHandler()}
          disabled={!board || !group || !name}
          className="create-btn"
        >
          CREATE TASK
        </button>
      </div>
    </div>
  );
};

export default CreatItemForm;
