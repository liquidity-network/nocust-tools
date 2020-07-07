import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface Props {
  itemSelected: string;
  items: Array<any>;
  getSelectedItem?: (item: string) => void;
  padding?: string;
  minWidth?: string;
  fontSize?: string;
  width?: string;
  extraWord?: string;
}
const Dropdown = (props: Props) => {
  const wrapperRef = useRef(null);
  const {
    itemSelected,
    items,
    padding,
    minWidth,
    width,
    extraWord,
    fontSize,
    getSelectedItem,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(itemSelected);
  const handleItemClick = (item: string) => {
    setIsOpen(!isOpen);
    setSelectedItem(item);
    getSelectedItem && getSelectedItem(item);
  };

  function handleClickOutside(event) {
    const wrapper: any = wrapperRef.current;
    if (!wrapper.contains(event.target)) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  return (
    <Container>
      <InnerContainer ref={wrapperRef}>
        <DropdownBtn
          style={{
            padding: padding || '10px 15px',
            fontSize: fontSize || '15px',
            width: width || 'auto',
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{extraWord}</span> {selectedItem}
          {isOpen ? (
            <i className="fa fa-angle-up"></i>
          ) : (
            <i className="fa fa-angle-down"></i>
          )}
        </DropdownBtn>
        <DropdownMenu
          style={{
            display: isOpen ? 'block' : 'none',
            minWidth: minWidth || '140px',
          }}
        >
          {items.map((item: any, index: number) => (
            <DropDownItem key={index} onClick={() => handleItemClick(item)}>
              {item}
            </DropDownItem>
          ))}
        </DropdownMenu>
      </InnerContainer>
    </Container>
  );
};

export default Dropdown;

const Container = styled.div`
  display: inline-block;
`;

const InnerContainer = styled.div`
  position: relative;
  z-index: 999;
`;

const DropdownBtn = styled.button`
  border: none;
  box-shadow: none;
  background: ${(props) => props.theme.data.blueColor};
  color: #fff;
  border-radius: 25px;
  outline: none;
  cursor: pointer;
  i {
    margin-left: 10px;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.16);
  text-align: left;
  max-height: 180px;
  overflow-y: auto;
`;

const DropDownItem = styled.div`
  padding: 5px 15px;
  color: ${(props) => props.theme.data.textColor};
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background: ${(props) => props.theme.data.blueColor};
    color: #fff;
  }
`;
