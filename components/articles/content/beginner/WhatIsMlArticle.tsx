"use client";

import { ArticlePost } from "../../layout/article-post";
import {
  CodeBlock,
  MathBlock,
  CalloutBox,
  AhaBox,
  SimulationLinks,
} from "../../components";

const sklearnExample = `
from sklearn.linear_model import LinearRegression, LogisticRegression

# [hours studied, sleep hours]
X = [[1, 8], [2, 7], [3, 7], [4, 6], [5, 6], [6, 5], [7, 5], [8, 4]]
scores = [42, 48, 56, 63, 71, 78, 86, 91]  # a number -> regression
passed = [0, 0, 0, 1, 1, 1, 1, 1]           # a label -> classification

new_student = [[5, 6]]

score_model = LinearRegression().fit(X, scores)
print("Predicted score:", score_model.predict(new_student)[0])

pass_model = LogisticRegression().fit(X, passed)
print("Pass probability:", pass_model.predict_proba(new_student)[0, 1])`;

const pytorchExample = `
import torch
from torch import nn

X = torch.tensor([[1.0], [2.0], [3.0], [4.0]])
y = torch.tensor([[3.0], [5.0], [7.0], [9.0]])

model = nn.Linear(1, 1)
loss_fn = nn.MSELoss()
optimizer = torch.optim.SGD(model.parameters(), lr=0.01)

for _ in range(1000):
    prediction = model(X)
    loss = loss_fn(prediction, y)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()`;

export default function WhatIsMlArticle() {
  return (
    <ArticlePost
      title="Regression, Classification, and Deep Learning: What Kind of Guess Are You Making?"
      author="Keval Kansagra"
      description="Regression and classification describe the job. Deep learning describes one kind of machinery that can do either job. Let us make that distinction feel obvious."
      image={{
        src: "/article/beginner/what-is-ml-hero.webp",
        alt: "A student dataset branching into a score, a label, and a deep learning model",
      }}
    >


      <h2>One Student, Three Questions</h2>
      <p>
        Imagine a student walks into your tiny machine learning lab. You know
        their hours studied and hours slept. Now ask three different questions:
      </p>
      <ul>
        <li>
          <strong>What score will they get?</strong> The answer is a number.
          That is a regression task.
        </li>
        <li>
          <strong>Will they pass?</strong> The answer is a category. That is a
          classification task.
        </li>
        <li>
          <strong>Can we tell whether a photo shows a correct answer?</strong>
          The answer may still be a label, but the input is now a messy image.
          A deep learning model may be useful.
        </li>
      </ul>
      <p>
        Here is the sentence that keeps the whole topic tidy:
        <strong> regression and classification describe the job; deep learning
        describes one kind of machinery.</strong>
      </p>

      <CalloutBox type="note" title="The One-Sentence Version">
        <p>
          A model is maths fitted to examples. Regression predicts a number.
          Classification predicts a label or class. Deep learning is a family
          of flexible models that can do regression, classification, and more.
        </p>
      </CalloutBox>

      <h2>What Is a Model, Really?</h2>
      <p>
        A model is a function with adjustable parameters. You give it features
        such as study hours and sleep hours. It combines them using its
        parameters and produces a prediction.
      </p>
      <MathBlock formula="\hat{y} = f(x; w)" />
      <p>
        Read that as: input <em>x</em> goes through a function <em>f</em> with
        parameters <em>w</em>, producing prediction <em>ŷ</em>. Training means
        choosing values for <em>w</em> that make the predictions less wrong on
        the training examples.
      </p>
      <p>
        For a simple score model, the function may be no more mysterious than:
      </p>
      <MathBlock formula="\widehat{score} = w_1 \cdot hours + w_2 \cdot sleep + b" />
      <p>
        The weights say how much each feature matters to the fitted equation.
        The bias gives the equation a starting point. The model is not a tiny
        person inside your laptop. It is a set of numbers selected from data.
      </p>

      <h2>Regression: When the Answer Slides</h2>
      <p>
        Regression is for a target where nearby values make sense: score,
        price, temperature, demand, or delivery time. Predicting 71.4 points
        is meaningful. Predicting 71.4 as a class is not.
      </p>
      <p>
        A common training loss is mean squared error. It measures the distance
        between the real answer and the model&apos;s answer, squares the distance,
        then averages the result:
      </p>
      <MathBlock formula="MSE = \frac{1}{n}\sum_{i=1}^{n}(y_i - \hat{y}_i)^2" />
      <p>
        Squaring prevents positive and negative mistakes from cancelling out
        and makes large mistakes hurt more. Lower MSE is better, but the useful
        question is always: lower than what baseline, on which data?
      </p>

      <h2>Classification: When the Answer Is a Bucket</h2>
      <p>
        Classification chooses among labels such as pass or fail, spam or not
        spam, and cat or dog. Many classifiers first produce a score or
        probability, then apply a threshold to turn that number into a label.
      </p>
      <MathBlock formula="P(y \mid x)" />
      <p>
        This means “the probability of label <em>y</em> given input <em>x</em>.”
        If the model estimates an 0.82 chance of passing, a default 0.5
        threshold would say pass. In real work, the threshold depends on the
        cost of false positives and false negatives. It is a decision, not a
        law of nature.
      </p>
      <CalloutBox type="warning" title="The Logistic Regression Name Trap">
        <p>
          Logistic regression has “regression” in its name, but it is commonly
          used for classification. It fits a relationship between features and
          log-odds, then turns that score into a probability. Judge a model by
          the target it predicts, not by one word in its name.
        </p>
      </CalloutBox>

      <h2>Deep Learning: More Machinery, Same Basic Idea</h2>
      <p>
        Deep learning uses neural networks with layers of learned parameters.
        Those layers can build increasingly useful representations: edges and
        shapes in an image, patterns in audio, or relationships in text.
      </p>
      <p>
        The important correction is that deep learning is not a third output
        type. A neural network can predict a number, a class, the next token,
        or a representation. It is often a good choice when the input is large,
        messy, or high-dimensional, but a classical model can still be the
        better choice for a small, clean table.
      </p>


      <h2>The Supervised Learning Loop</h2>
      <p>
        For the supervised examples in this article, the loop is simple:
      </p>
      <ol>
        <li><strong>Collect:</strong> features plus a target for each row.</li>
        <li><strong>Predict:</strong> let the current model make guesses.</li>
        <li><strong>Measure:</strong> calculate a loss or metric.</li>
        <li><strong>Fit:</strong> change parameters or split rules to reduce error.</li>
        <li><strong>Check:</strong> evaluate on validation data the model did not use to fit.</li>
      </ol>
      <p>
        This is a useful beginner map, not a claim that every learning system
        trains in exactly the same way. Trees, neural networks, and clustering
        algorithms use different fitting procedures. The common idea is that
        data and an objective shape a function that produces useful outputs.
      </p>


      <AhaBox>
        <p>
          Regression and classification tell you what the answer looks like.
          Deep learning tells you one possible way to build the fitter. Do not
          confuse the question with the machinery answering it.
        </p>
      </AhaBox>

      <h2>Where the Technology Fits</h2>
      <p>
        You do not need four frameworks to answer one beginner question. Each
        tool has a different job:
      </p>
      <ul>
        <li>
          <strong>pandas</strong> reads and cleans tables. Use it before model
          training, not as the model itself.
        </li>
        <li>
          <strong>scikit-learn</strong> gives you classical estimators,
          pipelines, metrics, and validation. It is the first default for
          clean tabular data.
        </li>
        <li>
          <strong>FastAPI</strong> puts a trained model behind an HTTP endpoint.
          It serves predictions; it does not train the model.
        </li>
        <li>
          <strong>PyTorch</strong> gives you tensors, neural network layers,
          automatic differentiation, and optimizers. Reach for it when the
          input or model needs deep learning.
        </li>
      </ul>
      <p>
        Freshers should expect to move between these jobs: inspect data, choose
        a baseline, train, evaluate, package, serve, and monitor. The model is
        one component in that loop.
      </p>

      <h2>Try Two Baselines with scikit-learn</h2>
      <p>
        This code demonstrates the API difference between a number and a label.
        It is a toy demonstration, not a fair model competition. A real
        comparison needs a train and validation split, suitable metrics, and
        more than eight rows.
      </p>
      <CodeBlock code={sklearnExample} language="python" title="One dataset, two prediction tasks" />
      <p>
        The first estimator learns a score. The second learns a probability of
        passing. Same feature table, different target column, different question.
      </p>

      <h2>Optional Bridge: The Same Fitted-Math Idea in PyTorch</h2>
      <p>
        Do not install PyTorch for the first CSV project just to sound advanced.
        Here is the smallest training loop so you can see what a neural-network
        framework adds: tensors, a neural network module, a loss, gradients,
        and parameter updates.
      </p>
      <CodeBlock code={pytorchExample} language="python" title="A tiny PyTorch regression loop" />
      <p>
        The loop is longer because you are spelling out the training machinery.
        scikit-learn hides most of those details behind <code>fit</code>. PyTorch
        becomes useful when you need custom layers, image or text models, or a
        training loop you control.
      </p>

      <h2>What Freshers Should Expect</h2>
      <p>
        Industry ML is rarely “pick an algorithm and celebrate.” Expect to
        spend time on:
      </p>
      <ul>
        <li>checking whether the data represents the problem you care about;</li>
        <li>cleaning missing, duplicated, and inconsistent values;</li>
        <li>building a dumb baseline before a fancy model;</li>
        <li>choosing metrics that match the cost of mistakes;</li>
        <li>preventing leakage between training and evaluation;</li>
        <li>examining errors instead of staring at one score;</li>
        <li>serving predictions and watching whether real inputs drift.</li>
      </ul>

      <CalloutBox type="tip" title="Start Simple">
        <p>
          For a small table, begin with a simple scikit-learn baseline. If it
          solves the problem, you have a useful model and a benchmark. If it
          fails, the failure tells you what to investigate before you add a
          neural network.
        </p>
      </CalloutBox>

      <h2>Now Go Play With It</h2>
      <p>
        Change the student&apos;s hours and watch the answer change. Then ask
        yourself a better question: did you change the output type, the model
        family, or only the input?
      </p>
      <SimulationLinks
        simulations={[
          { slug: "linear-regression", description: "Drag points around and feel how regression fits numbers" },
          { slug: "logistic-regression", description: "Turn scores into probabilities and labels" },
          { slug: "gradient-descent", description: "Watch parameters move to reduce the loss" },
        ]}
      />
    </ArticlePost>
  );
}
