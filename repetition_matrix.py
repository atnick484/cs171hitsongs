import sys
from math import sqrt
from re import UNICODE, findall

from svg_grid import svg_for_matrix


def normalize_line(line):
	return findall(r"(?:\w|')+", line.rstrip().lower(), UNICODE)

def lines_for_text(text):
	normalized_lines = [normalize_line(line) for line in text.splitlines()]
	return [line for line in normalized_lines if line]

def normalized_lines(text):
	return [normalize_line(line) for line in text if len(normalize_line(line)) > 0]

def corpus_from_lines(lines):
	result = []
	for line in lines:
		for word in line:
			if word not in result:
				result.append(word)
	return result

def vector_for_line(line, corpus):
	return [len([word for word in line if word == test_word]) for test_word in corpus]

def vectors_from_lines(lines):
	corpus = corpus_from_lines(lines)
	return [vector_for_line(line, corpus) for line in lines]

def vector_length(vector):
	return sqrt(sum([x*x for x in vector]))

def dot_product(vector1, vector2):
	return sum([vector1[i] * vector2[i] for i in range(len(vector1))])

def cosine_between(vector1, vector2):
	return dot_product(vector1, vector2) / (vector_length(vector1) * vector_length(vector2))

def generate_matrix(lines):
	size = len(lines)
	return [[cosine_between(lines[i], lines[j]) for i in range(size)] for j in range(size)]

def matrix_for_file(text):
	generate_matrix(lines_for_text(text))

def create_svg(text):
	lines = normalized_lines(text)
	vectors = vectors_from_lines(lines)
	matrix = generate_matrix(vectors)

	return svg_for_matrix(matrix, low_color='88BA99', high_color='1DB954')