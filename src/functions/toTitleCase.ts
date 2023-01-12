function toTitleCase(str: any) {
    return str.replace(
        /\w\S*/g,
        function (txt: any) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

export default toTitleCase