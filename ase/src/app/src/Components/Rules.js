import React from "react";
import RuleEditor from "./RuleEditor";
import Paper from "material-ui/Paper";
import { Toolbar, ToolbarGroup, ToolbarTitle } from "material-ui/Toolbar";
import PropTypes from "prop-types";
import AddIcon from "material-ui-icons/AddCircle";
import IconButton from "material-ui/IconButton";

const Rules = ({ rules, onRulesChange }) => {
  const onRuleChange = (i, rule) => {
    rules[i] = rule;

    onRulesChange(rules);
  };

  const onAddRule = () => {
    rules.push({ id: "", expr: "" });
    onRulesChange(rules);
  };

  const styles = {
    smallIcon: {
      width: 24,
      height: 24
    },
    small: {
      width: 50,
      height: 50
    }
  };

  return (
    <Paper
      style={{
        padding: 10
      }}
      zDepth={2}
    >
      <Toolbar>
        <ToolbarGroup>
          <ToolbarTitle text="Rules" />
        </ToolbarGroup>
        <ToolbarGroup>
          <IconButton
            tooltip="Add Ruæe"
            iconStyle={styles.smallIcon}
            style={styles.small}
            touch={true}
            onClick={onAddRule}
          >
            <AddIcon />
          </IconButton>
        </ToolbarGroup>
      </Toolbar>
      {rules.map((rule, ruleIdx) => (
        <RuleEditor
          rule={rule}
          ruleIdx={ruleIdx}
          onRuleChange={rule => onRuleChange(ruleIdx, rule)}
          key={ruleIdx}
        />
      ))}
    </Paper>
  );
};

Rules.propTypes = {
  rules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      expr: PropTypes.string.isRequired
    })
  ).isRequired,
  onRulesChange: PropTypes.func.isRequired
};

export default Rules;
