#pragma once
#include "user_repo.h"


class CSVRepository : public UserRepository {
public:
	CSVRepository(const std::vector<Event>& events, const std::string& userFile);

	std::vector<Event>& getUserEvents() override;
	int getNumberOfEvents() override;

	void addUserEvent(const Event& event) override;
	void deleteUserEvent(int index) override;

	void writeToFile() override;
	std::string& getFile() override;

	~CSVRepository();
};