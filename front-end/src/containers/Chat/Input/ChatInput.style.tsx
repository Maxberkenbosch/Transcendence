import styled from "styled-components";

import {
    lightTextColor,
    magicNum,
    mainColor,
    smallRadius
} from "../../../styles/StylingConstants";

const Container = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: calc(${magicNum} / 4);

    &:before {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        height: 100%;
        width: 100%;

        border-radius: 0px 0px 6px 6px;

        background: rgb(226, 226, 240);
        background: linear-gradient(
            180deg,
            rgba(226, 226, 240, 0) 0%,
            rgba(226, 226, 240, 1) 10%,
            rgba(226, 226, 240, 1) 100%
        );
    }

    .input-wrapper {
        z-index: 100;
        height: calc(${magicNum});
        width: 100%;
        border-radius: 1000px;
        display: grid;
        grid-template-columns: 6fr 144px 72px;
        background-color: ${mainColor};
    }

    .send-button {
        background-color: ${mainColor};

        color: white;
        border: none;

        &:hover {
            cursor: pointer;
        }
    }

    .input {
        background-color: white;
        border-radius: 1000px 0px 0px 1000px;
    }

    .simple-message-input {
        height: 100%;
        input {
            border: none;
            padding-left: calc(${magicNum} / 4);
            border-radius: 100px 0px 0px 100px;
            width: 100%;
            height: 100%;
        }
    }

    .picture-message-input {
        position: relative;
        height: 100%;

        .img-preview {
            border-radius: ${smallRadius} ${smallRadius} 0 ${smallRadius};
            overflow: hidden;
            position: absolute;
            background-color: black;
            height: 500px;
            width: 500px;
            bottom: 0;
            max-width: 100%;
            max-height: calc(${magicNum} * 4);

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        .picture-input {
            padding: calc(${magicNum} / 4);
            position: absolute;
            bottom: 0;
            width: 100%;

            label,
            input {
                position: relative;
                width: 100%;
            }

            input {
                border: none;
                border-radius: 100px;
            }

            label {
                font-weight: bold;
                display: block;
                color: white;
                text-shadow: 0px 0px 4px #000000;
            }
        }
    }

    .message-type-select {
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 0px 100px 100px 0px;
        padding: calc(${magicNum} / 8);
        color: ${lightTextColor};

        span {
            font-size: 12px;
        }
    }
`;

const SelectTypeIcon = styled.div<{ selected: boolean }>`
    border-radius: 100px;
    width: 100%;
    height: 100%;

    display: ${({ selected }) => (selected ? `none` : `flex`)};

    justify-content: center;
    align-items: center;

    img {
        transform: translateX(-10%);
        width: calc(${magicNum} / 2);
        height: calc(${magicNum} / 2);
    }
`;

const SelectionBox = styled.div<{ selected: boolean }>`
    display: ${({ selected }) => (selected ? `flex` : `none`)};

    justify-content: space-between;

    gap: calc(${magicNum} / 8);
    bottom: 0;
    right: 0;
    flex-direction: column;
    position: absolute;

    border-radius: 1000px;

    span {
        display: inline-block;
        border-radius: 100px;
        height: calc(${magicNum});
        width: calc(${magicNum});
        background-color: ${lightTextColor};
        color: black;
    }
`;

export { Container, SelectTypeIcon, SelectionBox };
