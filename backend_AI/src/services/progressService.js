const calculateProgress = (
    history
) => {

    if (
        !history ||
        history.length < 2
    ) {
        return 0;
    }

    const latest =
        history[0].score;

    const oldest =
        history[
            history.length - 1
        ].score;

    return latest - oldest;
};

module.exports = {
    calculateProgress,
};