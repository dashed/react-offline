// 3rd-party imports

import expect from "expect";
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";

// local imports

import Offline from "src/";

// eslint-disable-next-line
const displayOffline = ({ isOffline }) => {
    return isOffline ? <div>I am offline</div> : <div>I am online</div>;
};

// Based on: https://stackoverflow.com/a/38807630/412627
function mockNavigatorOnline(getOnline, setOnline) {
    const descriptor = {
        configurable: true,
        get: getOnline
    };

    // 1st method.
    Object.defineProperty(
        navigator.constructor.prototype,
        "onLine",
        descriptor
    );

    // Check whether the code above "took". We check both for `true`
    // and `false`.
    setOnline(() => false);
    let passes = navigator.onLine === false;

    setOnline(() => true);
    passes = passes && navigator.onLine === true;

    // 2nd method.
    if (!passes) {
        // eslint-disable-next-line
        navigator = Object.create(navigator, { onLine: descriptor });
    }
}

describe("render prop", () => {
    let node;

    let __is_online = true;
    const setOnline = transform => {
        __is_online = transform(__is_online);
        return __is_online;
    };

    before(() => {
        const getOnline = () => {
            return __is_online;
        };
        mockNavigatorOnline(getOnline, setOnline);
    });

    beforeEach(() => {
        node = document.createElement("div");
    });

    afterEach(() => {
        unmountComponentAtNode(node);
    });

    it("displays online", () => {
        setOnline(() => true);
        expect(navigator.onLine).toEqual(true);

        render(<Offline render={displayOffline} />, node, () => {
            expect(node.innerHTML).toContain("I am online");
        });
    });

    it("displays offline", () => {
        setOnline(() => false);
        expect(navigator.onLine).toEqual(false);

        render(<Offline render={displayOffline} />, node, () => {
            expect(node.innerHTML).toContain("I am offline");
        });
    });
});

describe("function as child prop", () => {
    let node;

    let __is_online = true;
    const setOnline = transform => {
        __is_online = transform(__is_online);
        return __is_online;
    };

    before(() => {
        const getOnline = () => {
            return __is_online;
        };
        mockNavigatorOnline(getOnline, setOnline);
    });

    beforeEach(() => {
        node = document.createElement("div");
    });

    afterEach(() => {
        unmountComponentAtNode(node);
    });

    it("displays online", () => {
        setOnline(() => true);
        expect(navigator.onLine).toEqual(true);

        render(<Offline>{displayOffline}</Offline>, node, () => {
            expect(node.innerHTML).toContain("I am online");
        });
    });

    it("displays offline", () => {
        setOnline(() => true);
        expect(navigator.onLine).toEqual(true);

        render(<Offline>{displayOffline}</Offline>, node, () => {
            expect(node.innerHTML).toContain("I am online");
        });
    });
});

describe("onChange", () => {
    let node;

    let __is_online = true;
    const setOnline = transform => {
        __is_online = transform(__is_online);
        return __is_online;
    };

    before(() => {
        const getOnline = () => {
            return __is_online;
        };
        mockNavigatorOnline(getOnline, setOnline);
    });

    beforeEach(() => {
        node = document.createElement("div");
    });

    afterEach(() => {
        unmountComponentAtNode(node);
    });

    it("trigger when switching from online to offline", () => {
        setOnline(() => true);
        expect(navigator.onLine).toEqual(true);

        let num_of_calls = 0;

        const onChange = ({ isOffline, isOnline }) => {
            expect(num_of_calls).toEqual(0);
            num_of_calls++;
            expect(num_of_calls).toEqual(1);

            expect(navigator.onLine).toEqual(false);
            expect(isOffline).toEqual(true);
            expect(isOnline).toEqual(false);
        };

        render(
            <Offline onChange={onChange}>{displayOffline}</Offline>,
            node,
            () => {
                expect(node.innerHTML).toContain("I am online");
            }
        );

        expect(num_of_calls).toEqual(0);

        const event = new CustomEvent("offline", {});
        setOnline(() => false);
        window.dispatchEvent(event);

        expect(num_of_calls).toEqual(1);
    });

    it("trigger when switching from offline to online", () => {
        setOnline(() => false);
        expect(navigator.onLine).toEqual(false);

        let num_of_calls = 0;

        const onChange = ({ isOffline, isOnline }) => {
            expect(num_of_calls).toEqual(0);
            num_of_calls++;
            expect(num_of_calls).toEqual(1);

            expect(navigator.onLine).toEqual(true);
            expect(isOffline).toEqual(false);
            expect(isOnline).toEqual(true);
        };

        render(
            <Offline onChange={onChange}>{displayOffline}</Offline>,
            node,
            () => {
                expect(node.innerHTML).toContain("I am offline");
            }
        );

        expect(num_of_calls).toEqual(0);

        const event = new CustomEvent("online", {});
        setOnline(() => true);
        window.dispatchEvent(event);

        expect(num_of_calls).toEqual(1);
    });
});
