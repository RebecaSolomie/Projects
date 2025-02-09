#include <utility>
#include <vector>
#include <iostream>
#include <sstream>
#include "domain.h"

Event::Event(std::string title, std::string description, std::string date_time, int peopleGoing, std::string link)
{
	this->title = std::move(title);
	this->description = std::move(description);
	this->date_time = date_time;
	this->peopleGoing = peopleGoing;
	this->link = std::move(link);
}

std::string Event::getTitle() const
{
	return title;
}

std::string Event::getDescription() const
{
	return description;
}

std::string Event::getDateAndTime() const
{
	return date_time;
}

int Event::getPeopleGoing() const
{
	return peopleGoing;
}

std::string Event::getLink() const
{
	return link;
}

void Event::setTitle(std::string title)
{
	this->title = std::move(title);
}

void Event::setDescription(std::string description)
{
	this->description = std::move(description);
}

void Event::setDateAndTime(std::string date_time)
{
	this->date_time = date_time;
}

void Event::setPeopleGoing(int peopleGoing)
{
	this->peopleGoing = peopleGoing;
}

void Event::setLink(std::string link)
{
	this->link = std::move(link);
}

Event::~Event() = default;

bool Event::operator==(const Event& other) const
{
	return title == other.title;
}

std::vector<std::string> tokenize(const std::string& str, char delimiter) {
	std::vector<std::string> result;
	std::stringstream ss(str);
	std::string token;
	while (getline(ss, token, delimiter))
		result.push_back(token);
	return result;
}

std::istream& operator>>(std::istream& input, Event& e)
{
	std::string line;
	std::getline(input, line);
	std::vector<std::string> tokens;
	if (line.empty())
		return input;
	tokens = tokenize(line, ',');
	e.title = tokens[0];
	e.description = tokens[1];
	e.date_time = tokens[2];
	e.peopleGoing = std::stoi(tokens[3]);
	e.link = tokens[4];
	return input;
}
