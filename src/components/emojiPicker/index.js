import React from "react";
import Picker from "emoji-picker-react";

const emojiPicker = (props) => {
  const handleChange = ((event, emojiObject) => {
  props.onChange(emojiObject.emoji);
 })
  return(
  <div className="emoji-picker">
    {/* {console.log("emjoi picker call is called")} */}
    <Picker
      onEmojiClick={handleChange}
    />
  </div>
  )};

// console.log("EmojiPicker loading", Date.now());

export default emojiPicker;
