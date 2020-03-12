class ExtendedString extends String {
    constructor(x = '') {
        super(x);
    }

    static toProperCase(value) {
        return String(value)[0].toUpperCase() + String(value).slice(1).toLowerCase();
    }
}

export default ExtendedString;