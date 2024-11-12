import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { getUserProfileDetails, getUserContributions } from "@/services/apiCalls";
import { getUserDetails } from "@/utils/utils";
import { MaterialIcons } from '@expo/vector-icons'; // Make sure to install expo vector icons

const { width } = Dimensions.get('window');

const Profile = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userProfileDetails, setUserProfileDetails] = useState({});
    const [contributions, setContributions] = useState([]);
    const [error, setError] = useState(null);
console.log(userProfileDetails.avatar_url);

    const fetchProfileData = async () => {
        try {
            const { username } = await getUserDetails();
            const userData = await getUserProfileDetails(username);
            const userContribs = await getUserContributions(username);
            
            setUserProfileDetails(userData);
            setContributions(userContribs);
            setError(null);
        } catch (err) {
            console.log(err);
            setError("Failed to load user profile details.");
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchProfileData();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#7C7EFF" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={48} color="#FF6B6B" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchProfileData}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.scrollView}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.container}>
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: userProfileDetails.avatar_url }}
                            style={styles.avatar}
                        />
                        <View style={styles.statusIndicator} />
                    </View>
                    <Text style={styles.name}>{userProfileDetails.name || "Username"}</Text>
                    <Text style={styles.username}>@{userProfileDetails.login}</Text>
                </View>

                {/* Info Cards */}
                <View style={styles.infoContainer}>
                    <View style={styles.infoCard}>
                        <MaterialIcons name="business" size={20} color="#7C7EFF" />
                        <Text style={styles.infoText}>
                            {userProfileDetails.company || "No company listed"}
                        </Text>
                    </View>
                    <View style={styles.infoCard}>
                        <MaterialIcons name="location-on" size={20} color="#7C7EFF" />
                        <Text style={styles.infoText}>
                            {userProfileDetails.location || "Location unknown"}
                        </Text>
                    </View>
                </View>

                {/* Bio Section */}
                {userProfileDetails.bio && (
                    <View style={styles.bioContainer}>
                        <Text style={styles.bioText}>{userProfileDetails.bio}</Text>
                    </View>
                )}

                {/* Stats Section */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>
                            {userProfileDetails.public_repos || 0}
                        </Text>
                        <Text style={styles.statLabel}>Repositories</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>
                            {userProfileDetails.followers || 0}
                        </Text>
                        <Text style={styles.statLabel}>Followers</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>
                            {userProfileDetails.following || 0}
                        </Text>
                        <Text style={styles.statLabel}>Following</Text>
                    </View>
                </View>

                {/* Contributions Section */}
                <View style={styles.contributionsContainer}>
                    <Text style={styles.sectionTitle}>Contributions</Text>
                    <View style={styles.contributionGrid}>
                        {contributions?.contributions?.map((contribution, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.contributionDay,
                                    {
                                        backgroundColor: contribution.count > 0
                                            ? `rgba(124, 126, 255, ${Math.min(contribution.count * 0.25, 1)})`
                                            : "#F0F0F0"
                                    }
                                ]}
                            />
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    container: {
        flex: 1,
        padding: 16,
        marginBottom: 60,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: width * 0.2,
        height: width * 0.2,
        borderRadius: width * 0.15,
        borderWidth: 3,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    statusIndicator: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 15,
        height: 15,
        borderRadius: 7.5,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2D3748',
        marginBottom: 4,
    },
    username: {
        fontSize: 16,
        color: '#718096',
        marginBottom: 8,
    },
    infoContainer: {
        marginBottom: 24,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7FAFC',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
    },
    infoText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#4A5568',
    },
    bioContainer: {
        backgroundColor: '#F7FAFC',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    bioText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#4A5568',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#F7FAFC',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '700',
        color: '#7C7EFF',
    },
    statLabel: {
        fontSize: 12,
        color: '#718096',
        marginTop: 4,
    },
    contributionsContainer: {
        backgroundColor: '#F7FAFC',
        padding: 16,
        borderRadius: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 16,
    },
    contributionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    contributionDay: {
        width: (width - 64) / 20,
        height: (width - 64) / 20,
        margin: 1,
        borderRadius: 2,
    },
    retryButton: {
        marginTop: 16,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#7C7EFF',
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        marginTop: 8,
        fontSize: 16,
        color: '#FF6B6B',
        textAlign: 'center',
    },
});

export default Profile;