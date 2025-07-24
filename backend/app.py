@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    url = data['url']
    features = extract_features(url)
    result = svm_model.predict([features])
    return jsonify({"verdict": "phishing" if result[0] == 1 else "legit"})
