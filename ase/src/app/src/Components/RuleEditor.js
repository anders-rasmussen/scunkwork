import React from "react";
import PropTypes from "prop-types";
import classnames from "class-names";

const RuleEditor = ({ rule, ruleIdx, onRuleChange }) => {
  const className = classnames("rule-editor", {
    "rule-editor__error": !rule.id || !rule.expr
  });

  // Called when ID is updated
  const updateId = event => {
    const id = event.target.value;
    const newVar = {
      id: id,
      expr: rule.expr
    };

    onRuleChange(newVar);
  };

  return (
    <div className={className}>
      <label>ID</label>
      <input type="text" value={rule.id} onChange={updateId} key={ruleIdx} />
      <textarea defaultValue={rule.expr} />
      <style jsx>{`
        input {
          border-radius: 3px;
          padding: 10px;
          margin: 0 5px;
          border: 1px solid rgb(170, 170, 170);
          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
          transition: border linear 0.2s, box-shadow linear 0.2s;
          width: 300px;
          height: 20px;
        }
        label {
          padding: 10px;
          font-weight: bold;
        }
        textarea {
          widht: 100%;
          height: 60px;
          grid-column: 1/3;
        }
        .rule-editor {
          border: 1px solid #eee;
          padding: 10px;
          border-radius: 6px;
          margin: 10px;
          display: grid;
          grid-template-columns: 30px 1fr;
          grid-template-rows: 50px 1fr;
        }
        .rule-editor__error {
          border: 1px solid red;
        }
      `}</style>
    </div>
  );
};

RuleEditor.propTypes = {
  rule: PropTypes.shape({
    id: PropTypes.string.isRequired,
    expr: PropTypes.string.isRequired
  }).isRequired,
  ruleIdx: PropTypes.number.isRequired,
  onRuleChange: PropTypes.func.isRequired
};

export default RuleEditor;
