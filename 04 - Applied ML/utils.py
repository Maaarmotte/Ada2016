import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from sklearn.metrics import confusion_matrix
from sklearn.learning_curve import validation_curve, learning_curve

def plot_confusion_matrix(y_true, y_pred, labels=None):
    sns.set_style('dark')
    cm = confusion_matrix(y_true, y_pred, labels)
    plt.matshow(cm, cmap=plt.cm.Blues)
    plt.colorbar()
    plt.ylabel('True label')
    plt.xlabel('Predicted label')
    plt.show()

def plot_validation_curve(estimator, X, y, param_name, param_range, scorer, cv=5):
    sns.set_style('darkgrid')
    train_scores, validation_scores = validation_curve(estimator, X, y, param_name, param_range, cv, scoring=scorer)
    train_scores_mean = np.mean(train_scores, axis=1)
    train_scores_std = np.std(train_scores, axis=1)
    validation_scores_mean = np.mean(validation_scores, axis=1)
    validation_scores_std = np.std(validation_scores, axis=1)
    plt.plot(param_range, train_scores_mean, color='darkorange', lw=2, label='Training score')
    plt.fill_between(param_range, train_scores_mean - train_scores_std, train_scores_mean + train_scores_std,
                    alpha=0.2, color='darkorange', lw=2)
    plt.plot(param_range, validation_scores_mean, color='navy', lw=2, label='Validation score')
    plt.fill_between(param_range, validation_scores_mean - validation_scores_std, validation_scores_mean + validation_scores_std,
                    alpha=0.2, color='navy', lw=2)

    plt.xlabel(param_name)
    plt.ylabel('score')
    plt.legend(loc='best')
    plt.ylim(0.0, 1.05)
    plt.show()

def plot_learning_curve(estimator, X, y, train_size, scorer, cv=5, legend_loc='best'):
    sns.set_style('darkgrid')
    train_sizes, train_scores, validation_scores = learning_curve(estimator, X, y, train_size, cv=cv, scoring=scorer)
    train_scores_mean = np.mean(train_scores, axis=1)
    train_scores_std = np.std(train_scores, axis=1)
    validation_scores_mean = np.mean(validation_scores, axis=1)
    validation_scores_std = np.std(validation_scores, axis=1)
    plt.plot(train_sizes, train_scores_mean, 'o-', color='darkorange', lw=2,
                 label="Training score")
    plt.fill_between(train_sizes, train_scores_mean - train_scores_std, train_scores_mean + train_scores_std, lw=2,
                     color='darkorange', alpha=0.2)
    plt.plot(train_sizes, validation_scores_mean, 'o-', color='navy', lw=2,
             label="Validation score")
    plt.fill_between(train_sizes, validation_scores_mean - validation_scores_std, validation_scores_mean + validation_scores_std, lw=2,
                     color='navy', alpha=0.2)
    plt.xlabel('# of samples')
    plt.ylabel('score')
    plt.legend(loc=legend_loc)
    plt.title('Learning curve')
    plt.ylim(0.0, 1.05)
    plt.show()

def ber(truth, predicted, classes):
    errors = 0
    lengths = [len(truth[truth == c]) for c in classes]
    n = len(truth)
    
    for c in classes:
        classError = 0  # Use a second variable to avoid float precision error when doing += 1/n
        for i in range(n):
            if predicted[i] != truth[i] and c == truth[i]:
                classError += 1
        errors += classError/lengths[c]
            
    return errors/len(classes)