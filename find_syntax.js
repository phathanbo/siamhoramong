const fs = require('fs');
let js = fs.readFileSync('adminZodiacAutoCarousel.js', 'utf8');

// Find all unbalanced braces
let stack = [];
for (let i = 0; i < js.length; i++) {
    if (js[i] === '{') stack.push(i);
    else if (js[i] === '}') {
        if (stack.length > 0) stack.pop();
        else console.log('Extra closing brace at', i);
    }
}
console.log('Unclosed open braces:', stack.length);
if (stack.length > 0) {
    console.log('Last unclosed brace is at:', stack[stack.length - 1]);
    console.log('Context:', js.substring(stack[stack.length - 1] - 50, stack[stack.length - 1] + 50));
}

// Find unclosed backticks
let btCount = (js.match(/`/g) || []).length;
console.log('Total backticks:', btCount);
