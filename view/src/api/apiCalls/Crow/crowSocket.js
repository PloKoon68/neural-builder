import { CROW_URL_WS } from "../../axious";

const generateSocket = (
    modelId,
    trainDataset,
    trainingHyperparameters,
    setEpochLogs,
    setTrainResult,
    setSocket,
    setModelInProcess,
    setIsTraining,
    setParameters,
    setNormalizerParameters,
    setIsTrained
) => {
    const newSocket = new WebSocket(CROW_URL_WS);

    // Ref holds ALL logs reliably
    const logStore = { current: [] };

    let flushInterval = null;

    const flushLogs = () => {
        // Push whatever we have into state
        console.log("Flushing logs...", logStore.current.length);
        setEpochLogs([...logStore.current]);
    };

    newSocket.onopen = () => {
        console.log("WebSocket connected. Sending training data...");

        const trainData = {
            modelId,
            ...trainDataset,
            ...trainingHyperparameters
        };

        newSocket.send(JSON.stringify(trainData));

        // Update React state every 500ms
        flushInterval = setInterval(flushLogs, 500);
    };

    newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
            case "initialLog":
            case "log":
                logStore.current.push(data.message);
                break;

            case "finalLog":
                logStore.current.push(data.message);
                flushLogs(); // flush immediately
                {
                    let score = data.message.split(": ")[1];
                    setTrainResult(score);
                }
                break;

            case "finalParams":
                setParameters(data.finalParams.modelParams);
                setNormalizerParameters(data.finalParams.normalizerParams);
                break;

            default:
                console.log("Unknown message:", data);
        }
    };

    newSocket.onclose = () => {
        console.log("WebSocket disconnected");

        // Final flush
        flushLogs();

        if (flushInterval) {
            clearInterval(flushInterval);
            flushInterval = null;
        }

        setSocket(null);
        setModelInProcess(false);
        setIsTraining(false);
        setIsTrained(true);
    };

    newSocket.onerror = (error) => {
        console.error("WebSocket Error:", error);

        flushLogs();

        if (flushInterval) {
            clearInterval(flushInterval);
            flushInterval = null;
        }

        setSocket(null);
    };

    return newSocket;
};

export { generateSocket };
