module.exports = function ReactMarkdown(props) {
  return React.createElement('div', { 'data-testid': 'react-markdown' }, props.children || '');
};