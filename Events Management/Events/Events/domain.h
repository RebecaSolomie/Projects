#pragma once
#include <string>
#include <chrono>


class Event {
private:
	std::string title;
	std::string description;
	std::string date_time;
	int peopleGoing;
	std::string link;
public:
	Event(std::string title = "empty", std::string description = "empty", std::string date_time = "empty", int peopleGoing = 0, std::string link = "empty");
	std::string getTitle() const;
	std::string getDescription() const;
	std::string getDateAndTime() const;
	int getPeopleGoing() const;
	std::string getLink() const;
	void setTitle(std::string title);
	void setDescription(std::string description);
	void setDateAndTime(std::string newDate_time);
	void setPeopleGoing(int peopleGoing);
	void setLink(std::string link);

	~Event();

	bool operator==(const Event& other) const;
	friend std::istream& operator>>(std::istream& input, Event& e);
};

