const initialState = {
    wait: 0,
    load: true
};

export default function contentReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_CONTENT': // Get content
            return {...state, content: action.res.data, load: state.load};
        default:
            return state;
    }
}