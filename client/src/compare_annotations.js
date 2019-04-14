function compareAnnotations(a1, a2) {
    if ((a1.upvotes - a1.downvotes) - (a2.upvotes - a2.downvotes) === 0) {
        return a1.upvotes - a2.upvotes;
    } else {
        return (a1.upvotes - a1.downvotes) - (a2.upvotes - a2.downvotes);
    }
}

export default compareAnnotations;