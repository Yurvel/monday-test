import React from 'react';

const Snackbar = ({ status }) => {
  const currentClass = 'snackbar ' + status;

  return (
    <div className={currentClass}>
      {(status === 'success') && "Done! Task created!"}
      {(status === 'error') && "Error! Try again."}
    </div>
  )
}

export default Snackbar;
