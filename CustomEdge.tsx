import React, { FC } from 'react';
import { EdgeProps, getSmoothStepPath, EdgeLabelRenderer, BaseEdge, getBezierPath, getStraightPath} from 'reactflow';

const CustomEdge: FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style,
  source,
  target
}) => {
  let ell; //[edgePath, labelX, labelY]

  if (data.type == 'smoothstep') {
    ell = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      });
  } else if (data.type == 'straight') {
    ell = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
      });
  } else {
    ell = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      });
  }
  const unique_id = id+source+target; //generates a unique id

  const [edgePath, labelX, labelY] = ell;
  function descShow() {
    document.getElementById(unique_id).style.display = 'block'
  }
  function descOff() {
    document.getElementById(unique_id).style.display = 'none'
  }

  let rel;
  if (data.label == "💀") {
    rel = "murder victim"
  } else if (data.label == "👊") {
    rel = "friend"
  } else {
    rel = data.label
  }

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            zIndex: 2,
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: '#ffffff',
            padding: 4,
            paddingTop: 0,
            paddingBottom: 0,
            fontSize: 10,
            fontWeight: 700,
            border: "2px solid " + style.stroke,
            borderWidth: '2px',
            borderRadius: 5,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <span onMouseEnter={() => descShow()} onMouseLeave={() => descOff()}>{data.label}</span>
          <div id={unique_id} style={{
            position: 'absolute',
            width:0,
            height:0,
            left: '115%',
            bottom: '30%',
            borderTop: '5px solid transparent',
            borderRight: '26px solid '+ style.stroke,
            borderBottom: '5px solid transparent',
            display: 'none',
          }}>
            <span style={{
            position: 'absolute',
            marginLeft: 20,
            marginTop: -20,
            padding: 7,
            paddingTop: 0,
            paddingBottom: 0,
            textAlign: 'center',
            borderRadius: '6px',
            color: '#000',
            backgroundColor: '#fff',
            width: '200px',
            border: "2px solid " + style.stroke,
            fontWeight: "normal"
          }}>
            {target + " is " + rel + " of " + source.replace(' + ', ' and ') + "."}
          </span>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
