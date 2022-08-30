export default {
    "dataset": [
        {"name": "nlp", "descr": "Language models", "img": "datalab.png"}, 
        {"name": "weed", "descr": "Dataset with photographs of weed", "img": "datalab.png"}], 
    "tool": [
        {"name": "hopsworks", "descr": "A complete data science platform", "img": "hopsworks-symbol.png"}, 
        {"name": "jupyter notebook in container", "descr": "Jupyter notebook with Tensorflow", "img": "jupyter.png"},
        {"name": "just-a-vm", "descr": "Ubuntu with conda and CUDA drivers", "img": "datalab.png"}],
    "infra": [
        {"name": "Test machine", 
            "provider": "test",
            "type": "machine",
            "descr": "A test machine", 
            "img": "ice.png"},
        {"name": "ICE", 
            "provider": "Container ICE",
            "type": "container",
            "descr": "GPU, Cost:0 \n Compliance: EU", 
            "img": "ice.png"}, 
        {"name": "Container Azure", 
            "provider": "azure",
            "type": "container",
            "descr": "GPU, Cost: 30SEK/hour \n Compliance: non-EU", 
            "img": "azure-native.svg"},
        {"name": "Container GCP", 
            "provider": "test",
            "type": "container",
            "descr": "GPU, Cost: 30SEK/hour \n Compliance: non-EU", 
            "img": "gcp.png"},
    ]
}