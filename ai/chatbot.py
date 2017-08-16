'''
    Implementation of a chatbot API, relying on MMI-bidi and a LSTM model

'''

import numpy as np

from keras.preprocessing import sequence
from keras.utils import np_utils
from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation, Embedding
from keras.layers import LSTM, SimpleRNN, GRU, Flatten, Convolution1D, MaxPooling1D
from keras.initializers import RandomUniform

from keras import optimizers

def main():
    ## set things up
    model_name = "chatbot.h5"
    SEED = 1337  # for reproducibility
    np.random.seed(SEED)

    ## set up some hyperparameters
    hidden_units = 1000
    dim = 1000
    batch_size = 256

    initializer = RandomUniform(minval=-0.08, maxval=0.08, seed=SEED)
    sgd = optimizers.SGD(lr=0.1, clipnorm=1)

    ## build sentiment analysis model
    print('Building model...')

    # encoding: 4 LSTM layers
    left = Sequential()
    model.add(Embedding(hidden_units, dim, input_length=dim, \
        dropout=drop_rate))
    left.add(LSTM(output_dim=hidden_units, init=initializer, \
        inner_init=initializer, return_sequences=True))
    left.add(LSTM(output_dim=hidden_units, init=initializer, \
        inner_init=initializer, return_sequences=True))
    left.add(LSTM(output_dim=hidden_units, init=initializer, \
        inner_init=initializer, return_sequences=True))
    left.add(LSTM(output_dim=hidden_units, init=initializer, \
        inner_init=initializer, return_sequences=True))

    # decoding: 4 LSTM layers
    right = Sequential()
    right.add(LSTM(output_dim=hidden_units, init=initializer, \
        inner_init=initializer, return_sequences=True, go_backwards=True))
    right.add(LSTM(output_dim=hidden_units, init=initializer, \
        inner_init=initializer, return_sequences=True, go_backwards=True))
    right.add(LSTM(output_dim=hidden_units, init=initializer, \
        inner_init=initializer, return_sequences=True, go_backwards=True))
    right.add(LSTM(output_dim=hidden_units, init=initializer, \
        inner_init=initializer, return_sequences=True))

    # merge both networks
    model = Sequential()
    model.add(Merge([left, right], mode='sum'))

    ## get ready!
    model.compile(loss='binary_crossentropy',
                  optimizer=sgd,
                  metrics=['accuracy'])

    ## train it
    print('Train...')
    model.fit(X_train, y_train, batch_size=batch_size, nb_epoch=max_epochs,
              validation_data=(X_test, y_test))

    ## validate
    score, acc = model.evaluate(X_test, y_test,
                                batch_size=batch_size)
    print('Test score:', score)
    print('Test accuracy:', acc)

    ## save it
    model.save(model_name) 

if __name__ == "__main__":
    main()
