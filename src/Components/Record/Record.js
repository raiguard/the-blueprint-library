import React, { useState } from "react";
import useCopyClipboard from "react-use-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Record = ({ data, index, remove }) => {
  const [showChildren, setShowChildren] = useState(false);
  const [isCopied, setCopied] = useCopyClipboard(data.string, { successDuration: 2000 });

  const { type, name, children } = data;
  return (
    <div className="record-container">
      <div className="record">
        {remove && (
          <div className="inset-panel button-inset">
            <button className="icon-button" onClick={() => remove(index)}>
              <FontAwesomeIcon icon={["fas", "trash-alt"]} transform="up-3.5 left-1 shrink-2" />
            </button>
          </div>
        )}
        {type === "book" && (
          <div className="inset-panel button-inset">
            <button className="icon-button" onClick={() => setShowChildren(!showChildren)}>
              <FontAwesomeIcon
                icon={["fas", showChildren ? "caret-down" : "caret-right"]}
                transform={"grow-3 up-3" + (showChildren ? "left-5" : "right-1")}
              />
            </button>
          </div>
        )}
        <label>{name}</label>
        <div className="copy-button-container">
          {isCopied && <label className="copied">Copied!</label>}
          <div className="inset-panel button-inset copy-button">
            <button className="icon-button" onClick={setCopied} title="Copy to clipboard">
              <FontAwesomeIcon icon={["far", "clipboard"]} transform="up-3.5" />
            </button>
          </div>
        </div>
      </div>
      {children && children.length > 0 && (
        <div className="children-container">
          {showChildren && children.map((child, i) => <Record key={i} data={child} />)}
        </div>
      )}
    </div>
  );
};

export default Record;
