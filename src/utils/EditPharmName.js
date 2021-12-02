const EditPharmName = (data) => {
  const index = data.indexOf("(");
  if (index == -1) {
    return data;
  } else {
    return data.substring(0, index);
  }
};

export default EditPharmName;
