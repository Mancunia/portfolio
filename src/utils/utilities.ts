export enum loggerStatements{
    "Successfully created"=1,
    "Successfully updated"=2,
    "Successfully deleted"=3,
    "Successfully fetched"=4,
    "Error creating"=0.1,
    "Error updating"=1.1,
    "Error deleting"=2.1,
    "Error fetching"=4.1

}

class Utility{
    public static getDate(): String{
        return new Date().toUTCString()
    }
}

export default Utility