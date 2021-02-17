import React from "react";
import styled from "styled-components";

const StyledMenuBar = styled.div`
  height: 40px;
  width: 100%;
  background: black;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
`;

const StyledButton = styled.button`
  height: 32px;
  width: 32px;
  background: white;
  border-color: #bbb;
  border-with: 1px;
  margin: 4px;
`;

type MenuBarProps = {
  onRedraw: () => void;
  onFit: () => void;
};

export const MenuBar = ({ onRedraw, onFit }: MenuBarProps) => {
  return (
    <StyledMenuBar>
      <StyledButton onClick={onRedraw}>
        <svg
          id="prefix__Icons"
          xmlns="http://www.w3.org/2000/svg"
          x={0}
          y={0}
          viewBox="0 0 32 32"
          xmlSpace="preserve"
          width="1.5em"
          height="1.5em"
        >
          <style>
            {
              ".prefix__st0{fill:none;stroke:#000;stroke-width:3;stroke-linejoin:round;stroke-miterlimit:10}"
            }
          </style>
          <circle className="prefix__st0" cx={16} cy={16} r={6} />
          <circle className="prefix__st0" cx={25.5} cy={9.5} r={2.5} />
          <circle className="prefix__st0" cx={5.5} cy={5.5} r={2.5} />
          <circle className="prefix__st0" cx={7.5} cy={26.5} r={2.5} />
          <circle className="prefix__st0" cx={26.5} cy={23.5} r={2.5} />
          <path
            className="prefix__st0"
            d="M12.3 20.7l-3.2 3.9M7.3 7.3l4.5 4.5M23.5 11L21 12.7M24.5 22l-3.6-2.6"
          />
        </svg>
      </StyledButton>
      <StyledButton onClick={onFit}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.2em"
          height="1.2em"
          viewBox="0 0 438.529 438.529"
        >
          <path d="M180.156 225.828c-1.903-1.902-4.093-2.854-6.567-2.854-2.475 0-4.665.951-6.567 2.854l-94.787 94.787-41.112-41.117c-3.617-3.61-7.895-5.421-12.847-5.421s-9.235 1.811-12.851 5.421c-3.617 3.621-5.424 7.905-5.424 12.854v127.907c0 4.948 1.807 9.229 5.424 12.847 3.619 3.613 7.902 5.424 12.851 5.424h127.906c4.949 0 9.23-1.811 12.847-5.424 3.615-3.617 5.424-7.898 5.424-12.847s-1.809-9.233-5.424-12.854l-41.112-41.104 94.787-94.793c1.902-1.903 2.853-4.086 2.853-6.564 0-2.478-.953-4.66-2.853-6.57l-32.548-32.546zM433.11 5.424C429.496 1.807 425.212 0 420.263 0H292.356c-4.948 0-9.227 1.807-12.847 5.424-3.614 3.615-5.421 7.898-5.421 12.847s1.807 9.233 5.421 12.847l41.106 41.112-94.786 94.787c-1.901 1.906-2.854 4.093-2.854 6.567s.953 4.665 2.854 6.567l32.552 32.548c1.902 1.903 4.086 2.853 6.563 2.853s4.661-.95 6.563-2.853l94.794-94.787 41.104 41.109c3.62 3.616 7.905 5.428 12.854 5.428s9.229-1.812 12.847-5.428c3.614-3.614 5.421-7.898 5.421-12.847V18.268c.003-4.953-1.793-9.228-5.417-12.844z" />
        </svg>
      </StyledButton>
    </StyledMenuBar>
  );
};
