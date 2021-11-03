import styled, { css } from "styled-components";

const Button = styled.button<{
    active: boolean;
}>`
    background-color: ${({ active }) => (active ? "red" : "blue")};
    border: none;
    padding: 30px;
    border-radius: 10px;
    color: white;
    width: 300px;

    :hover {
        opacity: 0.7;
        cursor: pointer;
    }

    ${({ disabled }) =>
        disabled &&
        css`
            background-color: gray;
            opacity: 0.4;
            :hover {
                cursor: not-allowed;
                opacity: 0.4;
            }
        `}
`;

export default Button;
