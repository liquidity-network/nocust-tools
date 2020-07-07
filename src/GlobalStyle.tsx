import { createGlobalStyle } from 'styled-components';

interface Props {
  width: string;
}
const GlobalStyle = createGlobalStyle`
    body {
        transition: all 0.3s ease;
        width: ${(props: Props) => (props.width ? props.width : 'auto')}
    }

    
  `;

export default GlobalStyle;
