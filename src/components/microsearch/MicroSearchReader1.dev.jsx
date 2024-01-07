
const Reader1 = ({ blockIndex, blockIndices }) => {
  console.log("shared info", blockIndex )
  return (
      <div >
      <h2>Block Index: {blockIndex}</h2>
      <p>Block Indices: {JSON.stringify(blockIndices)}</p>
      </div>
  )
}
export default Reader1