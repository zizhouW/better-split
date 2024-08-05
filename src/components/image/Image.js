import React, { useState } from "react";

export const Image = (props) => (
  <img {...props} src={`${process.env.PUBLIC_URL}${props.src}`} />
);
