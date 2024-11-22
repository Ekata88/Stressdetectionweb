import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.impute import SimpleImputer
from imblearn.over_sampling import SMOTE
import matplotlib.pyplot as plt
import seaborn as sns

# Step 1: Load and clean the dataset
data = pd.read_csv('data_stress-2.csv', sep=';')
data.columns = data.columns.str.strip()  # Clean column names

# Step 2: Replace commas with dots and convert to numeric for all columns except 'Stress Levels'
for column in data.columns[:-1]:  # Exclude 'Stress Levels' column
    data[column] = data[column].str.replace(',', '.').astype(float)

# Ensure the 'Stress Levels' column is of integer type
data['Stress Levels'] = data['Stress Levels'].astype(int)

# Step 3: Handle Missing Values
imputer = SimpleImputer(strategy='mean')
data.iloc[:, :-1] = imputer.fit_transform(data.iloc[:, :-1])

# Step 4: Select features and target labels
X = data[['snoring range', 'respiration rate', 'body temperature', 'limb movement',
          'blood oxygen', 'eye movement', 'hours of sleep', 'heart rate']]
y = data['Stress Levels']

# Step 5: Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 6: Normalize the feature data
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Step 7: Apply SMOTE to balance classes in the training set
smote = SMOTE(random_state=42)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

# Step 8: Hyperparameter tuning for MLPClassifier
param_grid = {
    'hidden_layer_sizes': [(50,), (100,), (50, 50), (100, 100)],
    'alpha': [0.0001, 0.001, 0.01],
    'learning_rate_init': [0.001, 0.01, 0.1]
}
grid_search = GridSearchCV(MLPClassifier(max_iter=1000, random_state=42, early_stopping=True, validation_fraction=0.2),
                           param_grid, cv=5)
grid_search.fit(X_train_resampled, y_train_resampled)
best_mlp_model = grid_search.best_estimator_

# Step 9: Train the best MLP model on the resampled training data
best_mlp_model.fit(X_train_resampled, y_train_resampled)

# Step 10: Make predictions on the test set with the MLP model
y_pred_mlp = best_mlp_model.predict(X_test)

# Step 11: Alternative Model - RandomForestClassifier
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train_resampled, y_train_resampled)
y_pred_rf = rf_model.predict(X_test)

# Step 12: Evaluate both models
print("MLP Classifier Results:")
print(f"Accuracy: {accuracy_score(y_test, y_pred_mlp):.2f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred_mlp))

print("Random Forest Classifier Results:")
print(f"Accuracy: {accuracy_score(y_test, y_pred_rf):.2f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred_rf))

# Step 13: Visualize confusion matrices for both models
plt.figure(figsize=(12, 5))

# Confusion Matrix for MLP
plt.subplot(1, 2, 1)
sns.heatmap(confusion_matrix(y_test, y_pred_mlp), annot=True, fmt='d', cmap='Blues',
            xticklabels=np.unique(y), yticklabels=np.unique(y))
plt.title('Confusion Matrix - MLP Classifier')
plt.xlabel('Predicted')
plt.ylabel('Actual')

# Confusion Matrix for Random Forest
plt.subplot(1, 2, 2)
sns.heatmap(confusion_matrix(y_test, y_pred_rf), annot=True, fmt='d', cmap='Blues',
            xticklabels=np.unique(y), yticklabels=np.unique(y))
plt.title('Confusion Matrix - Random Forest Classifier')
plt.xlabel('Predicted')
plt.ylabel('Actual')

plt.tight_layout()
plt.show()
joblib.dump(best_model, 'newstress_model.pkl')

# Check if the file has been created
if os.path.exists('newstress_model.pkl'):
    print("Model file 'best_stress_model.pkl' created successfully.")
else:
    print("Model file 'best_stress_model.pkl' was not created.")
